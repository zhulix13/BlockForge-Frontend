# BlockForge Frontend Integration Guide

Welcome to the BlockForge developer documentation. This guide is designed for frontend developers building the hunter and administrator dashboards.

## 1. Project Overview
BlockForge is a task-completion marketplace where **Hunters** earn USDC rewards for completing social media tasks (follows, likes, retweets, etc.). 

### Dashboards
- **Hunter Dashboard**: For users to find tasks, submit proof (screenshots), manage their Solana wallet, and withdraw earnings.
- **Admin Dashboard**: For platform operators to create tasks, review user proof, process withdrawals, and monitor platform health.
- **Superadmin Features**: Users with high-level access can manage team roles (assigning Admins) and moderate users (banning/deactivating).

---

## 2. Authentication Flow
BlockForge uses **X (Twitter) OAuth 2.0** for all user authentication.

### Login Process
1.  **Initiate**: Call `GET /api/v1/auth/x`. This redirects the user to X.
2.  **Callback**: X redirects back to your frontend with a `code`. The frontend should forward this to `GET /api/v1/auth/x/callback?code=...&state=...`.
3.  **Session**: On success, the backend sets a secure `HttpOnly` cookie named `bf_token`.
4.  **Identity**: Call `GET /api/v1/auth/me` to get the logged-in user's profile and assigned role (`USER`, `ADMIN`, or `SUPERADMIN`).

> [!IMPORTANT]
> All subsequent API requests should include the cookie. For testing/non-browser clients, you can use the `Authorization: Bearer <token>` header.

---

## 3. Data Schema (Core Models)

| Model | Description |
| :--- | :--- |
| **User** | Social identity (X identity), Role, Wallet Address, and isActive status. |
| **Task** | Title, reward (microunits), status (`ACTIVE`, `PAUSED`), and a list of **Steps**. |
| **TaskStep** | Specific action (e.g., "Like this tweet") with a target URL. |
| **Submission** | A Hunter's proof of completion, containing screenshot URLs and a status (`PENDING`, `APPROVED`, `REJECTED`). |
| **Withdrawal** | A request to payout USDC to a user's wallet. |
| **Transaction** | Ledger record for every reward earned or withdrawal made. |
| **Notification**| Real-time alerts for task status, submission reviews, or payouts. |

---

## 4. API Reference

### Response Structure
All responses follow a standard envelope:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Specific error explanation"
}
```

### Hunter API Modules

#### User & Profile
- `GET /user/profile`: Returns full profile, verified wallet, and **available/pending balance**.
- `PATCH /user/wallet`: Update the user's Solana wallet address.
- `GET /user/transactions`: List paginated ledger history.

#### Discovering Tasks
- `GET /tasks`: List all `ACTIVE` tasks with rewards. Support filtering by level (`EASY`, `MEDIUM`, `HARD`).
- `GET /tasks/:taskId`: Get full details and steps for a specific task.

#### Submissions (Proofs)
1.  **Upload Image**: `POST /submissions/upload-url` (provide `fileName` and `contentType`) to get a secure pre-signed URL for direct upload to storage.
2.  **Submit**: `POST /submissions` (provide `taskId`, `screenshotUrl`, and `proofs` array).
3.  **History**: `GET /submissions/my` to track progress and feedback on your proofs.

#### Withdrawals
- `POST /withdrawals`: Request a payout (requires `amount` in USDC).
- `GET /withdrawals/my`: Track withdrawal request history.

### Administrative API Modules

#### Dashboard & User Management
- `GET /admin/stats`: Aggregate platform metrics (Total users, active tasks, total payouts).
- `GET /admin/users`: Search and list all users.
- `PATCH /admin/users/:userId/role` (**Superadmin**): Change user role (`USER`, `ADMIN`).
- `PATCH /admin/users/:userId/status` (**Superadmin**): Activate/Deactivate (Ban) users.

#### Task Management
- `POST /tasks/admin`: Create a new task with multiple steps.
- `PATCH /tasks/admin/:taskId`: Update metadata or toggle status (`ACTIVE`/`PAUSED`).
- `DELETE /tasks/admin/:taskId`: Permanent removal.

#### Reviewing Work
- `GET /submissions/admin/pending`: List all proofs awaiting review.
- `POST /submissions/admin/:submissionId/review`: Approve or Reject a submission. 
  - *Note: Approving automatically credits the user's available balance.*

#### Processing Payouts
- `GET /withdrawals/admin`: List pending withdrawal requests.
- `POST /withdrawals/admin/:withdrawalId/complete`: Mark a payout as sent (requires `transactionHash`).

---

## 5. Technical Notes for Frontend

### Currency Management
The backend stores all amounts as **microunits** (integers) to avoid floating-point errors.
- **Conversion**: Divide by `1,000,000` to get the USDC value for display.
- **Recommendation**: Use a library like `Decimal.js` for calculations on the frontend if needed.

### Soft Deletion & Banning
If a user is deactivated by a Superadmin, every API request will immediately return `401 Unauthorized` with the message `Account is deactivated.` Redirect the user to a "Banned" screen if this occurs.

### Real-time UI
Poll `GET /api/v1/notifications` every minute or use an interval to fetch recent notifications for the user. Look for `isRead: false` to show badge alerts.
