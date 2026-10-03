# Playavida Safe Authentication Cross-Reference

Checked 2026-09-26. Scope: authentication only. No deployment, environment, schema, or production-record writes were performed.

## 1. Live production deployment confirmation

Vercel's alias lookup for `www.playavida.org` resolved to deployment `dpl_eZ33Mruee6aUW9Wyhc8A3DYjnBev`, project `prj_Yt7OdSgtvxfhXBRctBqmHm4uxeb7`.

Git SHA, branch, deployment status, inclusion of `6ce1b2c`, and presence of lazy `getTeableClient()` in the function bundle: **UNKNOWN**. The actual Playavida repository is not in the shared workspace. The available project is a starter, and the older uploaded adapter is unrelated and was not used as Playavida source of truth.

Vercel authorization initially failed with 403 invalidToken; reauthorization allowed alias lookup. Further raw deployment/environment/log fetches were avoided because the tools return unfiltered payloads, which can contain contact metadata, environment values, and unsanitized exceptions. No latest-commit-equals-live assumption was made.

## 2. Latest `/api/auth/session` result

Fresh unauthenticated GET, without cookie or Authorization header:

| HTTP status | App code | Stage | Correlation ID | Handler reached? | External request attempted? |
|---|---|---|---|---|---|
| 500 | Not returned | unknown | Not returned | UNKNOWN | UNKNOWN |

Safe platform code: `FUNCTION_INVOCATION_FAILED`. Response content type: `text/plain`.
Vercel request ID (not an application correlation ID): `sfo1::2pk8t-1790453523955-d023ac775240`.
This is an observed fresh request, not a claim about the latest historical user request.

## 3. Latest `/api/auth/send-otp` result

Fresh POST used the deliberately invalid, non-email synthetic marker `healthcheck`; no real address or OTP was supplied.

| HTTP status | App code | Stage | Correlation ID | Handler reached? | External request attempted? |
|---|---|---|---|---|---|
| 500 | Not returned | unknown | Not returned | UNKNOWN | UNKNOWN |

Safe platform code: `FUNCTION_INVOCATION_FAILED`. Response content type: `text/plain`.
Vercel request ID: `sfo1::vvkv4-1790453524280-3d59cbfa3f0c`.
The same failure was reproduced twice during this session. No provider delivery was requested to a real recipient, and no Resend diagnostic email was sent.

## 4. Vercel environment cross-reference table

`?` means not verifiable without current server source. Production and Preview were not inspected via an unfiltered value-returning tool. UNKNOWN must not be interpreted as absent, empty, or present. No claim is made that all required variables are set for Production.

| Vercel variable | Used by code? | Required for session? | Required for send-otp? | Production status | Preview status | Expected format / safe expected value | Current safe verification |
|---|---|---|---|---|---|---|---|
| TEABLE_API_BASE | ? | ? | ? | UNKNOWN | UNKNOWN | `https://app.teable.ai/api` | Cloud endpoint known; deployed value unknown |
| TEABLE_API_URL | ? | ? | ? | UNKNOWN | UNKNOWN | Alias only if current code reads it | Cannot mark NOT_USED_BY_CURRENT_CODE without source |
| TEABLE_API_KEY | ? | ? | ? | UNKNOWN | UNKNOWN | Server-only PAT; never public-prefixed | Value not retrieved |
| TEABLE_BASE_ID | ? | ? | ? | UNKNOWN | UNKNOWN | `bse...` identifier for intended Playavida base | Source base verified; deployed match unknown |
| RESEND_API_KEY | ? | ? | ? | UNKNOWN | UNKNOWN | Server-only provider key | Value not retrieved |
| EMAIL_FROM | ? | ? | ? | UNKNOWN | UNKNOWN | Sender mailbox on an authorized domain, e.g. `@playavida.org` | Configured domain and authorization unknown |
| EMAIL_REPLY_TO | ? | ? | ? | UNKNOWN | UNKNOWN | Valid reply-to mailbox if used | Configured domain unknown |
| OTP_SECRET | ? | ? | ? | UNKNOWN | UNKNOWN | Server-only high-entropy secret matching code validation | Value not retrieved |
| AUTH_SECRET | ? | ? | ? | UNKNOWN | UNKNOWN | Server-only secret; fallback semantics must be inspected | Value not retrieved |
| SESSION_SECRET | ? | ? | ? | UNKNOWN | UNKNOWN | Server-only secret; fallback semantics must be inspected | Value not retrieved |
| OTP_TTL_MINUTES | ? | ? | ? | UNKNOWN | UNKNOWN | Positive bounded integer; exact allowed range from current code | Range and deployed format unknown |
| OTP_MAX_ATTEMPTS | ? | ? | ? | UNKNOWN | UNKNOWN | Positive bounded integer; schema contract default 5 | Range and deployed format unknown |
| OTP_MAX_SENDS_PER_HOUR | ? | ? | ? | UNKNOWN | UNKNOWN | Positive bounded integer; exact range from current code | Range and deployed format unknown |
| AUTH_MOCK_MODE | ? | ? | ? | UNKNOWN | UNKNOWN | Code-defined boolean; must not enable mocks in Production | Format and state unknown |
| SUPERADMIN_EMAILS | ? | ? | ? | UNKNOWN | UNKNOWN | Code-defined address list | Count/domains unknown; addresses not retrieved |

Additional variables in the current server import graph could not be enumerated. Do not treat this minimum list as exhaustive. Do not add aliases or rotate secrets until the actual `process.env`, env helper, `serverEnv`, and `import.meta.env` contract is inspected. Preview presence never proves Production configuration, and an environment update requires a new deployment for that function runtime.

## 5. Teable connection cross-reference table

| Item | Expected by code | Teable source of truth | Safe status | Required action |
|---|---|---|---|---|
| API base | Current code unverified | `https://app.teable.ai/api` | Endpoint known; deployment match UNKNOWN | Check server-only client base/path joining |
| Authorization | Bearer PAT | Vercel PAT not inspected | UNKNOWN | Verify configured deployment token, not workspace token |
| Space/project access | Intended base only | Playavida `bse...` base | Workspace schema access works | Verify Vercel PAT resource grant |
| Base ID | Current mapping unknown | `bseeZUvNX8unS2KrzOE` | Safe non-secret ID known | Match current server map |
| OTP table | Current placeholder/mapping unknown | `tblVe1AhQ3zLW3eijnw` | Schema exists and readable from workspace | Map AuthenticationOtpChallenges |
| Session table | Current placeholder/mapping unknown | `tblap3ykSwQQk276MdN` | Schema exists and readable from workspace | Map AuthenticationSessions |
| Users table, if used | Current usage unknown | `tblB6Wiwy4KOx3Tjgui` | Schema readable | Resolve Teable record ID for links |
| Profiles table, if used | Current usage unknown | `tblLPvqsTYbSeHqbO88` | Schema readable | Only use if auth flow requires it |
| Session user link | Must link actual Users record | `user_id`, manyOne to Users | Relation verified | Teable API link value `{ "id": "rec..." }`, not `usr...` or email |
| Date serialization | Current client unverified | date/time fields exist | Write serialization not tested | Use ISO 8601 UTC timestamps; handle nullable dates explicitly |
| OTP select options | Current client unverified | Options below verified | Source schema verified | Match exact strings |
| Session select options | Current client unverified | Options below verified | Source schema verified | Match exact strings |
| OTP create/lookup/update | Needed for actual flow | Vercel PAT scopes unavailable | UNKNOWN | Run deployment-private synthetic diagnostic |
| Session create/lookup/revoke | Needed for actual flow | Vercel PAT scopes unavailable | UNKNOWN | Run deployment-private synthetic diagnostic |
| User/profile lookup | If current code uses them | Vercel PAT scopes unavailable | UNKNOWN | Verify only required scopes |

Exact OTP field mapping:

| Name | Field ID | Type |
|---|---|---|
| otp_challenge_id | fldqrWZZx1kOqF85SW6 | text |
| challenge_reference | fld9b8ALkGJyEreS0v5 | text |
| email_hash | fldMrBXahv8IF2ZfSRq | text |
| code_hash | fldxu0JAKVpnPe1dT4Z | text |
| purpose | fldur8lfsePSLSjRrNU | singleSelect |
| status | fldJLj85iRMZS5nXaEw | singleSelect |
| issued_at | fldynOsn7SehUUbh5BN | date/time |
| expires_at | fldMqPflVIUVtOmD6O2 | date/time |
| consumed_at | fldmg8Gc1s38xEDIj2p | date/time, nullable |
| attempt_count | fld9YVB0887WgJDGCpF | number |
| max_attempts | fld1bI4aBHz3FI1L8uD | number |
| send_window_started_at | fldLXfzbtD9kqsV3Mrl | date/time |
| send_count_in_window | fldGPX0Ea2wznF3bRz5 | number |
| request_ip_hash | fldwe8hvj2WU89HmWRN | text, nullable |
| correlation_id | fldhdrTNgfCu8wqpdgK | text |
| created_at | fldI5MR0UIUv0sFamab | createdTime |
| updated_at | fldGl2eG7qlDbuTjis8 | lastModifiedTime |

OTP purpose: `login`, `email_change`, `account_recovery`.
OTP status: `issued`, `consumed`, `expired`, `invalidated`, `attempts_exceeded`, `delivery_failed`.

Exact session field mapping:

| Name | Field ID | Type |
|---|---|---|
| session_id | fldifllwucVGxmFNXk1 | text |
| session_reference | fldxCAts0hZr2rNfINT | text |
| session_token_hash | fldl84pPnEaE789o4fb | text |
| session_version | fldIQcKFLYxwiUmaEWS | number |
| status | fldQSZKuqBlTqqKJCpV | singleSelect |
| issued_at | fldWuXufrAWPRx2H4AI | date/time |
| expires_at | fldBV5lfBYmE1JEp6fm | date/time |
| revoked_at | fldRqg9U9BSGCaLjGoz | date/time, nullable |
| revocation_reason | fld5qm5gX5Odl0WUYSU | singleSelect |
| last_seen_at | fldMtTkpzTKjtpFA81u | date/time, nullable |
| ip_hash | fldYF81hVrRFpAj67Tn | text, nullable |
| user_agent_hash | fldlQNHgh4WdBvpAOgX | text, nullable |
| created_at | fld0ORD0mYI2IKLm7Xu | createdTime |
| updated_at | fldNyr8Gjny6JYU8RCq | lastModifiedTime |
| user_id | fldLm29Lep2rFZHqaEw | manyOne link to Users |

Session status: `active`, `revoked`, `expired`, `disabled`.
Revocation reason: `logout`, `user_disabled`, `passwordless_recovery`, `superadmin_revoked`, `session_rotation`, `security_event`, `expired`, `other`.
Users account_status: `pending`, `active`, `suspended`, `disabled`.
Required/default values and concurrency are still application responsibilities. This was schema-only verification; no hashes or records were read.

## 6. Exact root-cause classification

**Verified failure class: Vercel `FUNCTION_INVOCATION_FAILED` on both authentication endpoints.** The response is outside the expected structured application error contract.

**Underlying root cause: UNKNOWN.** An import/initialization exception is plausible, including an eager env/client construction, but not proven. Missing env, incorrect deployed commit, Teable access, and Resend problems cannot be ranked or diagnosed without the active server bundle and filtered logs. The plain-text 500 is not evidence that Resend rejected a sender or that Teable rejected a PAT.

Do not label a workspace schema read `TEABLE_OK` for the production credential. The deployment-private Teable read/create/update diagnostic was not run. Resend configuration/sender verification was not run; `RESEND_CONFIG_OK` cannot be claimed.

## 7. Required action list for Mike, in order

1. In Vercel, inspect the active alias deployment ID above. Have OpenCode return only short commit SHA, branch, status, and whether `6ce1b2c` is an ancestor. Do not post full raw deployment metadata.
2. Provide the real Playavida auth source or let OpenCode work in it: env helpers, Teable client/table map, OTP/session repositories, both endpoint handlers, and AuthModal. Do not provide `.env` values.
3. Have OpenCode read runtime logs for the two request IDs above locally and emit only classified code/stage and whether handler/upstream calls were reached. Suppress stacks, raw requests, emails, and upstream payloads.
4. Compare the actual import graph's env names against Production and Preview using a local sanitized report. Never print values. Inspect deploy-time configuration as well as current project configuration.
5. Confirm lazy `getTeableClient()` and any other environment-dependent initialization are inside the handler's safe error boundary. Correct the demonstrated invocation failure, then redeploy and confirm the alias moved.
6. Ensure expected handler failures return `{success:false,code:"AUTH_*",message:"Unable to complete authentication request",stage,correlationId}`. Check AuthModal parses JSON when available and safely falls back for non-JSON platform failures.
7. From a deployment-private diagnostic, verify intended base/table/scopes/schema, then synthetic create/read/update if approved. Do not publicly expose a diagnostic route. No irreversible cleanup/deletion was performed here.
8. Only after Teable passes, verify Resend sender and key without sending. Request explicit approval before one internal test email if necessary. Then test one real OTP/session flow without exposing any values.

## 8. Files changed, if any

No application, Vercel configuration, or Teable resource changed.

Created local `/tmp/playavida_safe_auth_probe.mjs`: allowlisted HTTP diagnostic; no secrets, cookies, real email, or raw response body output. Created this report as the requested deliverable. The unrelated uploaded frontend adapter was not modified or adopted.

## 9. Tests run and results

- Vercel alias read: success after same-connection reauthorization; deployment ID confirmed.
- GET session twice: HTTP 500; final header check `FUNCTION_INVOCATION_FAILED`; no structured AUTH JSON.
- POST send-otp twice using invalid `healthcheck`: HTTP 500; final header check `FUNCTION_INVOCATION_FAILED`; no structured AUTH JSON.
- Workspace schema reads for OTP/session/Users/profile: succeeded; auth fields/options and Users relation verified. This does not test production PAT permissions.
- Current source, commit ancestry, lazy client, AuthModal, Production/Preview env values, historical runtime requests: not verified.
- Production synthetic database mutation and Resend diagnostic: not run. No email sent by this diagnostic.

## 10. Explicit confirmation that no secrets or personal data were exposed

No secret value, OTP/hash value, cookie, Authorization header, raw upstream body, real-user request data, or full Teable record is included in this report or emitted by the diagnostic script. No real email address was used in the probes.

**Privacy exception:** the Vercel alias integration tool itself returned creator contact metadata in its raw tool response. I cannot truthfully claim that no personal data entered the tool transcript. It is not reproduced here. Further raw metadata/log/env retrieval was stopped to avoid additional exposure. All status and field information in this deliverable is safe configuration metadata.
