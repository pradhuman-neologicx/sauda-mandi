# Angular Doctor report

> Self-contained findings for coding agents. Re-run `npx @abiramcodes/angular-doctor@latest --verbose` after fixes.

## Summary

- **Health score:** 90/100
- **Errors:** 0
- **Warnings:** 494
- **Infos:** 123
- **Project:** panel (angular-cli)
- **Angular:** 22.1.3
- **Scan duration:** 5520ms

## Official Angular migrations

Hub: [angular.dev/reference/migrations](https://angular.dev/reference/migrations)

Prefer official `ng generate @angular/core:*` schematics over hand edits when this report links one.
Use `--dry-run` first, then apply with `--path` for incremental modernization.
Run `ng build` and tests between multi-step migrations (especially standalone).

## Recommended migration commands

Commands deduplicated from this scan, in a sensible order. Scope with the `--path` shown or your project root.

### CommonModule to standalone imports

- **Docs:** https://angular.dev/reference/migrations/common-to-standalone
- **Command:**

```bash
ng generate @angular/core:common-to-standalone --dry-run
ng generate @angular/core:common-to-standalone
```

### inject() function

- **Docs:** https://angular.dev/reference/migrations/inject-function
- **Command:**

```bash
ng generate @angular/core:inject --dry-run
ng generate @angular/core:inject
```

### Signal inputs

- **Docs:** https://angular.dev/reference/migrations/signal-inputs
- **Command:**

```bash
ng generate @angular/core:signal-input-migration --dry-run
ng generate @angular/core:signal-input-migration
```

### Signal queries

- **Docs:** https://angular.dev/reference/migrations/signal-queries
- **Command:**

```bash
ng generate @angular/core:signal-queries-migration --dry-run
ng generate @angular/core:signal-queries-migration
```

### ngClass to class bindings

- **Docs:** https://angular.dev/reference/migrations/ngclass-to-class
- **Command:**

```bash
ng generate @angular/core:ngclass-to-class --dry-run
ng generate @angular/core:ngclass-to-class
```

### @Injectable to @Service

- **Docs:** https://angular.dev/reference/migrations/service
- **Command:**

```bash
ng generate @angular/core:service --dry-run
ng generate @angular/core:service
```

## How to fix

**Style guide:** [angular.dev/style-guide](https://angular.dev/style-guide)

1. Run applicable migrations from the hub and the **Recommended migration commands** section.
2. Fix style guide findings using the linked section per rule (naming, structure, components, templates).
3. Read grouped findings below for anything migrations do not cover.
4. Align with the `angular-developer` skill.
5. Re-scan with `npx @abiramcodes/angular-doctor@latest --verbose --scope changed`.

## hygiene

### oxlint/no-explicit-any (warning) — 228 occurrences in 32 files

- **Message:** Unexpected `any`. Specify a different type.
- **Locations:**
  - `src\app\admin\admin.component.ts:40:20`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:76:16`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:77:17`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:92:20`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:143:20`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:175:33`
  - `src\app\admin\loginpages\otp\otp.component.ts:32:9`
  - `src\app\admin\loginpages\otp\otp.component.ts:33:11`
  - `src\app\admin\loginpages\otp\otp.component.ts:36:10`
  - `src\app\admin\loginpages\otp\otp.component.ts:78:16`
  - `src\app\admin\loginpages\otp\otp.component.ts:82:17`
  - `src\app\admin\loginpages\otp\otp.component.ts:102:71`
  - `src\app\admin\loginpages\otp\otp.component.ts:130:33`
  - `src\app\admin\loginpages\signin\signin.component.ts:72:16`
  - `src\app\admin\loginpages\signin\signin.component.ts:73:17`
  - `src\app\admin\loginpages\signin\signin.component.ts:157:32`
  - `src\app\admin\loginpages\signin\signin.component.ts:189:33`
  - `src\app\admin\sauda-management\sauda-management.component.ts:738:56`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:46:25`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:157:11`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:180:17`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:184:16`
  - `src\app\admin\sidenav\sidenav.component.ts:37:10`
  - `src\app\admin\truck-management\truck-management.component.ts:667:56`
  - `src\app\core\auth\direct-access-guard.ts:24:20`
  - `src\app\core\model-class\course-batch.ts:13:15`
  - `src\app\core\model-class\course-batch.ts:20:24`
  - `src\app\core\model-class\course-batch.ts:37:14`
  - `src\app\core\model-class\course-batch.ts:38:13`
  - `src\app\core\model-class\course-batch.ts:43:13`
  - `src\app\core\model-class\course-batch.ts:44:17`
  - `src\app\core\model-class\course-batch.ts:52:12`
  - `src\app\core\model-class\course-batch.ts:53:14`
  - `src\app\core\model-class\course-batch.ts:57:16`
  - `src\app\core\model-class\course-batch.ts:58:10`
  - `src\app\core\model-class\course-batch.ts:62:12`
  - `src\app\core\model-class\course-batch.ts:63:11`
  - `src\app\core\model-class\course-batch.ts:72:17`
  - `src\app\core\model-class\course-batch.ts:74:15`
  - `src\app\core\model-class\course-batch.ts:83:12`
  - `src\app\core\model-class\course-batch.ts:84:20`
  - `src\app\core\model-class\course-batch.ts:88:13`
  - `src\app\core\model-class\course-batch.ts:89:18`
  - `src\app\core\model-class\employee.ts:31:16`
  - `src\app\core\model-class\employee.ts:32:14`
  - `src\app\core\model-class\employee.ts:34:14`
  - `src\app\core\model-class\employee.ts:35:13`
  - `src\app\core\model-class\employee.ts:37:13`
  - `src\app\core\model-class\employee.ts:38:17`
  - `src\app\core\model-class\employee.ts:39:13`
  - `src\app\core\model-class\employee.ts:44:11`
  - `src\app\core\model-class\employee.ts:45:12`
  - `src\app\core\model-class\fee-management.ts:4:9`
  - `src\app\core\model-class\fee-management.ts:18:9`
  - `src\app\core\model-class\fee-management.ts:25:12`
  - `src\app\core\model-class\fee-management.ts:39:11`
  - `src\app\core\model-class\fee-management.ts:41:14`
  - `src\app\core\model-class\fee-management.ts:42:24`
  - `src\app\core\model-class\fee-management.ts:72:12`
  - `src\app\core\model-class\fee-management.ts:76:22`
  - `src\app\core\model-class\fee-management.ts:79:28`
  - `src\app\core\model-class\fee-management.ts:115:19`
  - `src\app\core\model-class\fee-management.ts:116:20`
  - `src\app\core\model-class\fee-management.ts:117:15`
  - `src\app\core\model-class\fee-management.ts:122:23`
  - `src\app\core\model-class\fee-management.ts:127:19`
  - `src\app\core\model-class\fee-management.ts:129:15`
  - `src\app\core\model-class\fee-management.ts:130:20`
  - `src\app\core\model-class\fee-management.ts:131:11`
  - `src\app\core\model-class\fee-management.ts:152:16`
  - `src\app\core\model-class\fee-management.ts:153:19`
  - `src\app\core\model-class\fee-management.ts:154:23`
  - `src\app\core\model-class\fee-management.ts:155:16`
  - `src\app\core\model-class\fee-management.ts:156:17`
  - `src\app\core\model-class\fee-management.ts:157:23`
  - `src\app\core\model-class\fee-management.ts:158:21`
  - `src\app\core\model-class\fee-management.ts:165:12`
  - `src\app\core\model-class\fee-management.ts:166:24`
  - `src\app\core\model-class\fee-management.ts:167:23`
  - `src\app\core\model-class\fee-management.ts:168:22`
  - `src\app\core\model-class\fee-management.ts:169:21`
  - `src\app\core\model-class\fee-management.ts:170:23`
  - `src\app\core\model-class\fee-management.ts:232:23`
  - `src\app\core\model-class\file-extension-validator.directive.ts:4:55`
  - `src\app\core\model-class\login-signup.ts:48:13`
  - `src\app\core\model-class\login-signup.ts:49:26`
  - `src\app\core\model-class\login-signup.ts:50:12`
  - `src\app\core\model-class\login-signup.ts:51:9`
  - `src\app\core\model-class\parties.ts:7:17`
  - `src\app\core\model-class\parties.ts:8:18`
  - `src\app\core\model-class\parties.ts:9:21`
  - `src\app\core\model-class\parties.ts:10:21`
  - `src\app\core\model-class\parties.ts:23:17`
  - `src\app\core\model-class\parties.ts:24:18`
  - `src\app\core\model-class\parties.ts:25:21`
  - `src\app\core\model-class\parties.ts:26:21`
  - `src\app\core\model-class\test.ts:3:11`
  - `src\app\core\model-class\validations.ts:42:36`
  - `src\app\core\pipe\number-format.pipe.ts:9:20`
  - `src\app\core\services\api.service.ts:18:34`
  - `src\app\core\services\api.service.ts:75:30`
  - `src\app\core\services\api.service.ts:75:52`
  - `src\app\core\services\api.service.ts:81:27`
  - `src\app\core\services\api.service.ts:81:41`
  - `src\app\core\services\api.service.ts:81:63`
  - `src\app\core\services\api.service.ts:91:28`
  - `src\app\core\services\api.service.ts:91:42`
  - `src\app\core\services\api.service.ts:91:64`
  - `src\app\core\services\api.service.ts:101:33`
  - `src\app\core\services\api.service.ts:101:55`
  - `src\app\core\services\api.service.ts:111:29`
  - `src\app\core\services\api.service.ts:111:43`
  - `src\app\core\services\api.service.ts:111:65`
  - `src\app\core\services\api.service.ts:121:40`
  - `src\app\core\services\api.service.ts:121:57`
  - `src\app\core\services\api.service.ts:131:67`
  - `src\app\core\services\api.service.ts:141:41`
  - `src\app\core\services\api.service.ts:141:58`
  - `src\app\core\services\api.service.ts:154:17`
  - `src\app\core\services\api.service.ts:163:25`
  - `src\app\core\services\auth.interceptor.ts:11:30`
  - `src\app\core\services\auth.interceptor.ts:11:77`
  - `src\app\core\services\calendar.service.ts:19:26`
  - `src\app\core\services\calendar.service.ts:24:28`
  - `src\app\core\services\calendar.service.ts:29:29`
  - `src\app\core\services\calendar.service.ts:38:22`
  - `src\app\core\services\calendar.service.ts:43:23`
  - `src\app\core\services\calendar.service.ts:52:23`
  - `src\app\core\services\calendar.service.ts:57:33`
  - `src\app\core\services\calendar.service.ts:65:31`
  - `src\app\core\services\data.service.ts:12:26`
  - `src\app\core\services\Employee.service.ts:18:15`
  - `src\app\core\services\Employee.service.ts:19:18`
  - `src\app\core\services\Employee.service.ts:20:18`
  - `src\app\core\services\Employee.service.ts:29:19`
  - `src\app\core\services\Employee.service.ts:36:21`
  - `src\app\core\services\Employee.service.ts:36:38`
  - `src\app\core\services\Employee.service.ts:49:19`
  - `src\app\core\services\Employee.service.ts:56:30`
  - `src\app\core\services\error.interceptor.ts:6:30`
  - `src\app\core\services\error.interceptor.ts:8:29`
  - `src\app\core\services\Inquiry.service.ts:23:26`
  - `src\app\core\services\Inquiry.service.ts:23:42`
  - `src\app\core\services\Inquiry.service.ts:32:21`
  - `src\app\core\services\Inquiry.service.ts:37:24`
  - `src\app\core\services\Inquiry.service.ts:42:31`
  - `src\app\core\services\Inquiry.service.ts:51:23`
  - `src\app\core\services\Inquiry.service.ts:56:27`
  - `src\app\core\services\Inquiry.service.ts:69:74`
  - `src\app\core\services\Inquiry.service.ts:86:37`
  - `src\app\core\services\Inquiry.service.ts:86:47`
  - `src\app\core\services\Inquiry.service.ts:90:35`
  - `src\app\core\services\Inquiry.service.ts:90:45`
  - `src\app\core\services\Inquiry.service.ts:90:60`
  - `src\app\core\services\Inquiry.service.ts:98:33`
  - `src\app\core\services\Inquiry.service.ts:102:30`
  - `src\app\core\services\Inquiry.service.ts:113:39`
  - `src\app\core\services\Inquiry.service.ts:113:49`
  - `src\app\core\services\Inquiry.service.ts:118:35`
  - `src\app\core\services\Inquiry.service.ts:118:45`
  - `src\app\core\services\Inquiry.service.ts:118:60`
  - `src\app\core\services\Inquiry.service.ts:125:24`
  - `src\app\core\services\Inquiry.service.ts:128:30`
  - `src\app\core\services\Inquiry.service.ts:132:85`
  - `src\app\core\services\Inquiry.service.ts:144:23`
  - `src\app\core\services\Inquiry.service.ts:149:26`
  - `src\app\core\services\Inquiry.service.ts:156:34`
  - `src\app\core\services\Inquiry.service.ts:162:34`
  - `src\app\core\services\Inquiry.service.ts:162:50`
  - `src\app\core\services\Inquiry.service.ts:167:40`
  - `src\app\core\services\Inquiry.service.ts:176:41`
  - `src\app\core\services\Inquiry.service.ts:176:51`
  - `src\app\core\services\Inquiry.service.ts:180:32`
  - `src\app\core\services\Inquiry.service.ts:180:42`
  - `src\app\core\services\Inquiry.service.ts:180:57`
  - `src\app\core\services\Inquiry.service.ts:186:33`
  - `src\app\core\services\Inquiry.service.ts:186:43`
  - `src\app\core\services\Inquiry.service.ts:186:58`
  - `src\app\core\services\Inquiry.service.ts:192:45`
  - `src\app\core\services\Inquiry.service.ts:192:55`
  - `src\app\core\services\Inquiry.service.ts:196:28`
  - `src\app\core\services\Inquiry.service.ts:202:32`
  - `src\app\core\services\Inquiry.service.ts:207:23`
  - `src\app\core\services\Inquiry.service.ts:207:30`
  - `src\app\core\services\Inquiry.service.ts:212:23`
  - `src\app\core\services\Inquiry.service.ts:216:29`
  - `src\app\core\services\Inquiry.service.ts:226:41`
  - `src\app\core\services\Inquiry.service.ts:226:51`
  - `src\app\core\services\Inquiry.service.ts:230:37`
  - `src\app\core\services\Inquiry.service.ts:230:47`
  - `src\app\core\services\Inquiry.service.ts:230:62`
  - `src\app\core\services\Inquiry.service.ts:237:48`
  - `src\app\core\services\Inquiry.service.ts:237:58`
  - `src\app\core\services\Inquiry.service.ts:241:39`
  - `src\app\core\services\Inquiry.service.ts:241:49`
  - `src\app\core\services\Inquiry.service.ts:241:64`
  - `src\app\core\services\Inquiry.service.ts:251:39`
  - `src\app\core\services\Inquiry.service.ts:251:49`
  - `src\app\core\services\Inquiry.service.ts:251:64`
  - `src\app\core\services\Inquiry.service.ts:251:73`
  - `src\app\core\services\Inquiry.service.ts:251:80`
  - `src\app\core\services\Inquiry.service.ts:251:92`
  - `src\app\core\services\internet-interceptor.ts:17:26`
  - `src\app\core\services\internet-interceptor.ts:19:27`
  - `src\app\core\services\jwt.service.ts:29:20`
  - `src\app\core\services\login.service.ts:17:23`
  - `src\app\core\services\login.service.ts:17:40`
  - `src\app\core\services\login.service.ts:21:32`
  - `src\app\core\services\login.service.ts:21:49`
  - `src\app\core\services\login.service.ts:23:19`
  - `src\app\core\services\login.service.ts:30:28`
  - `src\app\core\services\login.service.ts:30:45`
  - `src\app\core\services\login.service.ts:32:19`
  - `src\app\core\services\login.service.ts:39:29`
  - `src\app\core\services\login.service.ts:49:19`
  - `src\app\core\services\login.service.ts:55:25`
  - `src\app\core\services\login.service.ts:55:39`
  - `src\app\core\services\login.service.ts:59:23`
  - `src\app\core\services\login.service.ts:59:37`
  - `src\app\core\services\login.service.ts:63:30`
  - `src\app\core\services\notification.service.ts:16:29`
  - `src\app\core\services\notification.service.ts:19:32`
  - `src\app\core\services\sauda-erp-mock.service.ts:50:20`
  - `src\app\core\services\sauda-erp-mock.service.ts:2747:14`
  - `src\app\core\services\sauda-erp-mock.service.ts:2810:54`
  - `src\app\website\components\navbar\navbar.component.ts:61:26`
  - `src\app\website\components\testimonials\testimonials.component.ts:126:52`
  - `src\app\website\components\testimonials\testimonials.component.ts:127:37`

### angular-doctor/filename-class-mismatch (warning) — 16 occurrences in 16 files

- **Message:** File stem "calendar" does not match class "UpdateHoliday".
- **Reference:** https://angular.dev/style-guide#naming
- **Locations:**
  - `src\app\core\model-class\calendar.ts:1:1` (fix: Prefer a file name like update-holiday.ts for this class.)
  - `src\app\core\model-class\course-batch.ts:1:1` — File stem "course-batch" does not match class "courses". (fix: Prefer a file name like courses.ts for this class.)
  - `src\app\core\model-class\fee-management.ts:1:1` — File stem "fee-management" does not match class "CreateFee". (fix: Prefer a file name like create-fee.ts for this class.)
  - `src\app\core\model-class\login-signup.ts:1:1` — File stem "login-signup" does not match class "SignIn". (fix: Prefer a file name like sign-in.ts for this class.)
  - `src\app\core\model-class\onboard.ts:1:1` — File stem "onboard" does not match class "OnBoardStudent". (fix: Prefer a file name like on-board-student.ts for this class.)
  - `src\app\core\model-class\parties.ts:1:1` — File stem "parties" does not match class "Createparty". (fix: Prefer a file name like createparty.ts for this class.)
  - `src\app\core\pipe\number-format.pipe.ts:1:1` — File stem "number-format.pipe" does not match class "NumberFormatPipe". (fix: Prefer a file name like number-format.ts for this class.)
  - `src\app\core\pipe\reverse-list.pipe.ts:1:1` — File stem "reverse-list.pipe" does not match class "ReverseIterablePipe". (fix: Prefer a file name like reverse-iterable.ts for this class.)
  - `src\app\core\pipe\safe-url.pipe.ts:1:1` — File stem "safe-url.pipe" does not match class "SafeUrlPipe". (fix: Prefer a file name like safe-url.ts for this class.)
  - `src\app\core\services\auth.interceptor.ts:1:1` — File stem "auth.interceptor" does not match class "AuthInterceptor". (fix: Prefer a file name like auth-interceptor.ts for this class.)
  - `src\app\core\services\classe-routines.service.ts:1:1` — File stem "classe-routines" does not match class "CalssService". (fix: Prefer a file name like calss.ts for this class.)
  - `src\app\core\services\Employee.service.ts:1:1` — File stem "Employee" does not match class "EmployeeService". (fix: Prefer a file name like employee.ts for this class.)
  - `src\app\core\services\error.interceptor.ts:1:1` — File stem "error.interceptor" does not match class "ErrorIntercept". (fix: Prefer a file name like error-intercept.ts for this class.)
  - `src\app\core\services\Inquiry.service.ts:1:1` — File stem "Inquiry" does not match class "InquiryService". (fix: Prefer a file name like inquiry.ts for this class.)
  - `src\app\core\services\loading.interceptor.ts:1:1` — File stem "loading.interceptor" does not match class "LoadingInterceptor". (fix: Prefer a file name like loading-interceptor.ts for this class.)
  - `src\app\core\services\notificationnew.service.ts:1:1` — File stem "notificationnew" does not match class "NotificationService". (fix: Prefer a file name like notification.ts for this class.)

### angular-doctor/file-hyphen-case (warning) — 2 occurrences in 2 files

- **Message:** File name should use hyphens between words.
- **Suggested fix:** Rename to kebab-case (for example user-profile.ts).
- **Reference:** https://angular.dev/style-guide#naming
- **Locations:**
  - `src\app\core\services\Employee.service.ts:1:1`
  - `src\app\core\services\Inquiry.service.ts:1:1`

### oxlint/no-unused-expressions (warning) — 1 occurrence

- **Message:** Expected expression to be used
- **Locations:**
  - `src\app\website\components\testimonials\testimonials.component.ts:143:5`

## accessibility

### template-eslint/label-has-associated-control (warning) — 161 occurrences in 14 files

- **Message:** A label component must be associated with a form element
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.html:5:7`
  - `src\app\admin\dashboard\dashboard.component.html:18:7`
  - `src\app\admin\firm-management\firm-management.component.html:188:9`
  - `src\app\admin\firm-management\firm-management.component.html:199:9`
  - `src\app\admin\firm-management\firm-management.component.html:209:9`
  - `src\app\admin\inventory-management\categories\categories.component.html:232:9`
  - `src\app\admin\inventory-management\categories\categories.component.html:273:9`
  - `src\app\admin\inventory-management\categories\categories.component.html:283:9`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:123:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:129:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:142:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:156:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:338:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:344:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:356:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:558:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:564:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:575:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:586:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:596:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:607:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:618:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:624:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:783:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:797:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:809:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:819:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:844:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:868:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:878:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:884:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:891:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:900:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:1067:11`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:157:9`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:163:9`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:176:11`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:185:11`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:194:11`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:15:9`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:57:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:70:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:108:17`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:156:21`
  - `src\app\admin\loginpages\otp\otp.component.html:11:7`
  - `src\app\admin\loginpages\otp\otp.component.html:39:7`
  - `src\app\admin\loginpages\signin\signin.component.html:17:7`
  - `src\app\admin\loginpages\signin\signin.component.html:38:9`
  - `src\app\admin\masters\uom\uom.component.html:246:11`
  - `src\app\admin\masters\uom\uom.component.html:288:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:279:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:293:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:303:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:314:13`
  - `src\app\admin\masters\warehouse\warehouse.component.html:323:13`
  - `src\app\admin\masters\warehouse\warehouse.component.html:331:13`
  - `src\app\admin\masters\warehouse\warehouse.component.html:340:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:136:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:142:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:152:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:177:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:183:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:192:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:202:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:763:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:773:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:778:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:789:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:799:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:808:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:814:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:823:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:835:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:841:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:884:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:892:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:898:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:904:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:910:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:953:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:958:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:964:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:970:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:976:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1019:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1029:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1039:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1050:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1118:15`
  - `src\app\admin\party-ledger\party-ledger.component.html:1133:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1196:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1203:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1208:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1217:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1223:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1229:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1235:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1436:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1450:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1491:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1505:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1521:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:76:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:82:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:92:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:102:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:256:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:265:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:272:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:287:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:303:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:318:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:338:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:353:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:362:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:367:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:376:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:382:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:388:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:416:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:421:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:426:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:435:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:453:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:459:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:464:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:475:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:481:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:486:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:502:9`
  - `src\app\admin\sauda-management\sauda-management.component.html:508:9`
  - `src\app\admin\sauda-management\sauda-management.component.html:889:9`
  - `src\app\admin\sauda-management\sauda-management.component.html:981:9`
  - `src\app\admin\truck-management\truck-management.component.html:65:11`
  - `src\app\admin\truck-management\truck-management.component.html:70:11`
  - `src\app\admin\truck-management\truck-management.component.html:80:11`
  - `src\app\admin\truck-management\truck-management.component.html:89:11`
  - `src\app\admin\truck-management\truck-management.component.html:99:11`
  - `src\app\admin\truck-management\truck-management.component.html:509:11`
  - `src\app\admin\truck-management\truck-management.component.html:527:11`
  - `src\app\admin\truck-management\truck-management.component.html:549:11`
  - `src\app\admin\truck-management\truck-management.component.html:559:11`
  - `src\app\admin\truck-management\truck-management.component.html:568:11`
  - `src\app\admin\truck-management\truck-management.component.html:577:11`
  - `src\app\admin\truck-management\truck-management.component.html:585:11`
  - `src\app\admin\truck-management\truck-management.component.html:590:11`
  - `src\app\admin\truck-management\truck-management.component.html:595:11`
  - `src\app\admin\truck-management\truck-management.component.html:606:11`
  - `src\app\admin\truck-management\truck-management.component.html:625:13`
  - `src\app\admin\truck-management\truck-management.component.html:640:13`
  - `src\app\admin\truck-management\truck-management.component.html:649:13`
  - `src\app\admin\truck-management\truck-management.component.html:654:13`
  - `src\app\admin\truck-management\truck-management.component.html:663:13`
  - `src\app\admin\truck-management\truck-management.component.html:710:9`
  - `src\app\admin\truck-management\truck-management.component.html:716:9`
  - `src\app\admin\truck-management\truck-management.component.html:787:9`
  - `src\app\admin\user-management\user-management.component.html:291:11`
  - `src\app\admin\user-management\user-management.component.html:301:13`
  - `src\app\admin\user-management\user-management.component.html:309:13`
  - `src\app\admin\user-management\user-management.component.html:323:11`
  - `src\app\admin\user-management\user-management.component.html:341:11`

### template-eslint/click-events-have-key-events (warning) — 63 occurrences in 12 files

- **Message:** click must be accompanied by either keyup, keydown or keypress event for accessibility.
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.html:32:9`
  - `src\app\admin\dashboard\dashboard.component.html:590:15`
  - `src\app\admin\firm-management\firm-management.component.html:160:1`
  - `src\app\admin\firm-management\firm-management.component.html:161:3`
  - `src\app\admin\firm-management\firm-management.component.html:238:1`
  - `src\app\admin\firm-management\firm-management.component.html:239:3`
  - `src\app\admin\inventory-management\categories\categories.component.html:212:1`
  - `src\app\admin\inventory-management\categories\categories.component.html:213:3`
  - `src\app\admin\inventory-management\categories\categories.component.html:253:1`
  - `src\app\admin\inventory-management\categories\categories.component.html:254:3`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:759:3`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:760:5`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:926:3`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:927:5`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:137:1`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:138:3`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:215:1`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:216:3`
  - `src\app\admin\masters\uom\uom.component.html:225:1`
  - `src\app\admin\masters\uom\uom.component.html:226:3`
  - `src\app\admin\masters\uom\uom.component.html:267:1`
  - `src\app\admin\masters\uom\uom.component.html:268:3`
  - `src\app\admin\masters\warehouse\warehouse.component.html:251:1`
  - `src\app\admin\masters\warehouse\warehouse.component.html:252:3`
  - `src\app\admin\masters\warehouse\warehouse.component.html:372:1`
  - `src\app\admin\masters\warehouse\warehouse.component.html:373:3`
  - `src\app\admin\masters\warehouse\warehouse.component.html:483:1`
  - `src\app\admin\masters\warehouse\warehouse.component.html:484:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:742:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:743:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:863:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:864:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:932:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:933:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:998:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:999:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:1157:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:1158:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:1257:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:1258:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:1395:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:1396:5`
  - `src\app\admin\sauda-management\sauda-management.component.html:543:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:544:3`
  - `src\app\admin\sauda-management\sauda-management.component.html:783:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:784:3`
  - `src\app\admin\sauda-management\sauda-management.component.html:853:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:854:3`
  - `src\app\admin\sauda-management\sauda-management.component.html:919:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:920:3`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:19:5`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:28:7`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:43:11`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:81:7`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:101:11`
  - `src\app\admin\truck-management\truck-management.component.html:750:1`
  - `src\app\admin\truck-management\truck-management.component.html:751:3`
  - `src\app\admin\user-management\user-management.component.html:263:1`
  - `src\app\admin\user-management\user-management.component.html:264:3`
  - `src\app\admin\user-management\user-management.component.html:384:1`
  - `src\app\admin\user-management\user-management.component.html:385:3`
  - `src\app\admin\user-management\user-management.component.html:499:1`
  - `src\app\admin\user-management\user-management.component.html:500:3`

### template-eslint/no-autofocus (warning) — 1 occurrence

- **Message:** The `autofocus` attribute should not be used, as it reduces usability and accessibility for users
- **Locations:**
  - `src\app\admin\firm-management\firm-management.component.html:190:11`

## maintainability

### angular-doctor/prefer-functional-interceptor (warning) — 7 occurrences in 5 files

- **Message:** Class-based HTTP interceptors are the legacy API.
- **Suggested fix:** Register a functional interceptor with provideHttpClient(withInterceptors([...])).
- **Reference:** https://angular.dev/guide/http
- **Locations:**
  - `src\app\app.config.ts:4:53`
  - `src\app\app.config.ts:36:16`
  - `src\app\app.config.ts:37:16`
  - `src\app\core\services\auth.interceptor.ts:7:30`
  - `src\app\core\services\error.interceptor.ts:4:29`
  - `src\app\core\services\internet-interceptor.ts:13:34`
  - `src\app\core\services\loading.interceptor.ts:12:33`

### angular-doctor/prefer-inject (warning) — 7 occurrences in 7 files

- **Message:** Constructor parameter injection detected. Prefer the inject() function for dependencies.
- **Suggested fix:** Run the inject() migration scoped with --path, then fix any manual edge cases.
- **Migration docs:** https://angular.dev/reference/migrations/inject-function
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:inject --dry-run
ng generate @angular/core:inject
```
- **Locations:**
  - `src\app\core\auth\direct-access-guard.ts:13:3`
  - `src\app\core\auth\student-auth-guard.ts:12:3`
  - `src\app\core\pipe\safe-url.pipe.ts:6:3`
  - `src\app\core\services\calendar.service.ts:13:3`
  - `src\app\core\services\classe-routines.service.ts:13:3`
  - `src\app\core\services\Inquiry.service.ts:13:3`
  - `src\app\core\services\notification.service.ts:10:3`

### angular-doctor/prefer-signal-query (warning) — 3 occurrences in 2 files

- **Message:** Decorator-based query @ViewChild found. Prefer the viewChild() signal query.
- **Suggested fix:** Run signal-queries-migration and re-run tests.
- **Migration docs:** https://angular.dev/reference/migrations/signal-queries
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:signal-queries-migration --dry-run
ng generate @angular/core:signal-queries-migration
```
- **Locations:**
  - `src\app\admin\admin.component.ts:33:3`
  - `src\app\admin\admin.component.ts:34:3`
  - `src\app\admin\dashboard\dashboard.component.ts:110:3`

### angular-doctor/lifecycle-hook-complexity (warning) — 2 occurrences in 2 files

- **Message:** ngOnInit contains 26 lines; prefer delegating to named methods.
- **Suggested fix:** Call small private methods from the lifecycle hook.
- **Reference:** https://angular.dev/style-guide#components-and-directives
- **Locations:**
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:42:3`
  - `src\app\admin\loginpages\otp\otp.component.ts:37:3` — ngOnInit contains 25 lines; prefer delegating to named methods.

### angular-doctor/prefer-class-binding (info) — 63 occurrences in 14 files

- **Message:** ngClass binding found. Prefer native class bindings.
- **Suggested fix:** Run ngclass-to-class migration where templates are eligible.
- **Migration docs:** https://angular.dev/reference/migrations/ngclass-to-class
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:ngclass-to-class --dry-run
ng generate @angular/core:ngclass-to-class
```
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.html:462:53`
  - `src\app\admin\dashboard\dashboard.component.html:595:17`
  - `src\app\admin\firm-management\firm-management.component.html:120:63`
  - `src\app\admin\firm-management\firm-management.component.html:134:56`
  - `src\app\admin\firm-management\firm-management.component.html:136:39`
  - `src\app\admin\firm-management\firm-management.component.html:261:45`
  - `src\app\admin\inventory-management\categories\categories.component.html:112:63`
  - `src\app\admin\inventory-management\categories\categories.component.html:124:56`
  - `src\app\admin\inventory-management\categories\categories.component.html:126:39`
  - `src\app\admin\inventory-management\categories\categories.component.html:174:63`
  - `src\app\admin\inventory-management\categories\categories.component.html:186:56`
  - `src\app\admin\inventory-management\categories\categories.component.html:188:39`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:98:63`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:112:56`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:114:39`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:24:11`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:79:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:116:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:130:23`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:164:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:179:27`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:223:11`
  - `src\app\admin\loginpages\otp\otp.component.html:19:11`
  - `src\app\admin\loginpages\otp\otp.component.html:47:11`
  - `src\app\admin\loginpages\signin\signin.component.html:21:11`
  - `src\app\admin\loginpages\signin\signin.component.html:44:11`
  - `src\app\admin\loginpages\signin\signin.component.html:46:31`
  - `src\app\admin\masters\uom\uom.component.html:114:63`
  - `src\app\admin\masters\uom\uom.component.html:126:56`
  - `src\app\admin\masters\uom\uom.component.html:128:39`
  - `src\app\admin\masters\uom\uom.component.html:186:63`
  - `src\app\admin\masters\uom\uom.component.html:198:56`
  - `src\app\admin\masters\uom\uom.component.html:200:39`
  - `src\app\admin\masters\warehouse\warehouse.component.html:120:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:127:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:134:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:140:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:202:63`
  - `src\app\admin\masters\warehouse\warehouse.component.html:223:56`
  - `src\app\admin\masters\warehouse\warehouse.component.html:225:39`
  - `src\app\admin\masters\warehouse\warehouse.component.html:411:45`
  - `src\app\admin\masters\warehouse\warehouse.component.html:562:9`
  - `src\app\admin\party-ledger\party-ledger.component.html:84:34`
  - `src\app\admin\party-ledger\party-ledger.component.html:257:42`
  - `src\app\admin\party-ledger\party-ledger.component.html:382:44`
  - `src\app\admin\party-ledger\party-ledger.component.html:518:44`
  - `src\app\admin\sauda-management\sauda-management.component.html:175:42`
  - `src\app\admin\sauda-management\sauda-management.component.html:549:38`
  - `src\app\admin\truck-management\truck-management.component.html:164:39`
  - `src\app\admin\truck-management\truck-management.component.html:170:42`
  - `src\app\admin\truck-management\truck-management.component.html:264:35`
  - `src\app\admin\truck-management\truck-management.component.html:330:42`
  - `src\app\admin\truck-management\truck-management.component.html:500:33`
  - `src\app\admin\truck-management\truck-management.component.html:501:31`
  - `src\app\admin\truck-management\truck-management.component.html:538:45`
  - `src\app\admin\truck-management\truck-management.component.html:539:33`
  - `src\app\admin\user-management\user-management.component.html:204:17`
  - `src\app\admin\user-management\user-management.component.html:234:19`
  - `src\app\admin\user-management\user-management.component.html:237:39`
  - `src\app\admin\user-management\user-management.component.html:444:15`
  - `src\app\admin\user-management\user-management.component.html:548:9`
  - `src\app\website\notification\notification.component.html:3:31`
  - `src\app\website\notification\notification.component.html:7:9`

### angular-doctor/prefer-signal-forms (info) — 15 occurrences in 15 files

- **Message:** Reactive or template-driven forms API (FormsModule). New forms should use signal forms.
- **Suggested fix:** Prefer the signal forms API for new form work.
- **Reference:** https://angular.dev/guide/forms/signals
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.ts:10:1`
  - `src\app\admin\firm-management\firm-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\inventory-management\categories\categories.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:4:1`
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:2:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\loginpages\otp\otp.component.ts:2:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\loginpages\signin\signin.component.ts:9:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\masters\uom\uom.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\masters\warehouse\warehouse.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\party-ledger\party-ledger.component.ts:4:1`
  - `src\app\admin\sauda-management\sauda-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormArray, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\truck-management\truck-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormArray, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\user-management\user-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\app.config.ts:15:1`

### angular-doctor/prefer-common-imports (info) — 13 occurrences in 13 files

- **Message:** CommonModule import detected. Prefer explicit standalone directive/pipe imports.
- **Suggested fix:** Run common-to-standalone migration for minimal imports per template.
- **Migration docs:** https://angular.dev/reference/migrations/common-to-standalone
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:common-to-standalone --dry-run
ng generate @angular/core:common-to-standalone
```
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.ts:9:10`
  - `src\app\admin\firm-management\firm-management.component.ts:2:10`
  - `src\app\admin\inventory-management\categories\categories.component.ts:2:10`
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:1:10`
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:2:10`
  - `src\app\admin\masters\uom\uom.component.ts:2:10`
  - `src\app\admin\masters\warehouse\warehouse.component.ts:2:10`
  - `src\app\admin\party-ledger\party-ledger.component.ts:1:10`
  - `src\app\admin\sauda-management\sauda-management.component.ts:2:10`
  - `src\app\admin\truck-management\truck-management.component.ts:2:10`
  - `src\app\admin\user-management\user-management.component.ts:2:10`
  - `src\app\app.config.ts:6:20`
  - `src\app\website\notification\notification.component.ts:2:10`

### angular-doctor/prefer-service-decorator (info) — 12 occurrences in 12 files

- **Message:** @Injectable found. Angular 22+ supports @Service for singletons.
- **Suggested fix:** Run service migration where @Service applies; keep @Injectable for multi providers.
- **Migration docs:** https://angular.dev/reference/migrations/service
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:service --dry-run
ng generate @angular/core:service
```
- **Locations:**
  - `src\app\core\auth\auth-guard.ts:7:1`
  - `src\app\core\auth\student-auth-guard.ts:7:1`
  - `src\app\core\services\calendar.service.ts:6:1`
  - `src\app\core\services\classe-routines.service.ts:6:1`
  - `src\app\core\services\Employee.service.ts:7:1`
  - `src\app\core\services\Inquiry.service.ts:6:1`
  - `src\app\core\services\jwt.service.ts:4:1`
  - `src\app\core\services\loader.service.ts:3:1`
  - `src\app\core\services\login.service.ts:6:1`
  - `src\app\core\services\notification.service.ts:6:1`
  - `src\app\core\services\notificationnew.service.ts:4:1`
  - `src\app\core\services\sauda-erp-mock.service.ts:413:1`

### angular-doctor/prefer-signal-input (info) — 1 occurrence

- **Message:** @Input decorator found. Prefer signal-based input() API.
- **Suggested fix:** Run signal-input-migration; verify public API compatibility.
- **Migration docs:** https://angular.dev/reference/migrations/signal-inputs
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:signal-input-migration --dry-run
ng generate @angular/core:signal-input-migration
```
- **Locations:**
  - `src\app\website\notification\notification.component.ts:33:3`

## performance

### angular-doctor/zone-js (warning) — 2 occurrences in 2 files

- **Message:** zone.js is still a dependency. Angular 20+ can run zoneless and drop this runtime.
- **Reference:** https://angular.dev/guide/zoneless
- **Locations:**
  - `src\environments\environment.ts:18:4` — This file imports zone.js. Zoneless apps do not need that import. (fix: Remove the zone.js import after switching the app to zoneless.)
  - `package.json:36:5` (fix: Provide zoneless change detection and remove zone.js.)

### angular-doctor/explicit-eager-change-detection (info) — 12 occurrences in 12 files

- **Message:** Explicit Eager change detection checks more of the component tree.
- **Suggested fix:** Omit changeDetection on Angular 22+ (OnPush is the default) or set ChangeDetectionStrategy.OnPush.
- **Reference:** https://angular.dev/best-practices/runtime-performance
- **Locations:**
  - `src\app\admin\admin.component.ts:16:5`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:16:5`
  - `src\app\admin\loginpages\otp\otp.component.ts:19:5`
  - `src\app\admin\loginpages\signin\signin.component.ts:52:5`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:28:3`
  - `src\app\admin\sidenav\sidenav.component.ts:23:5`
  - `src\app\app.component.ts:8:5`
  - `src\app\website\components\components.component.ts:7:5`
  - `src\app\website\components\navbar\navbar.component.ts:10:5`
  - `src\app\website\components\testimonials\testimonials.component.ts:26:5`
  - `src\app\website\home\home.component.ts:12:3`
  - `src\app\website\notification\notification.component.ts:16:5`

### angular-doctor/prefer-inject-async (info) — 7 occurrences in 5 files

- **Message:** JwtService is only used inside handlers. Consider injectAsync() so it loads in its own chunk on first use.
- **Reference:** https://angular.dev/api/core/injectAsync
- **Locations:**
  - `src\app\core\auth\auth-guard.ts:10:48` (fix: Replace inject(JwtService) with injectAsync(() => import('...').then((m) => m.JwtService)) and await it where used. The service must be auto-provided.)
  - `src\app\core\services\auth.interceptor.ts:7:58` (fix: Replace inject(JwtService) with injectAsync(() => import('...').then((m) => m.JwtService)) and await it where used. The service must be auto-provided.)
  - `src\app\core\services\Employee.service.ts:11:37` — ApiService is only used inside handlers. Consider injectAsync() so it loads in its own chunk on first use. (fix: Replace inject(ApiService) with injectAsync(() => import('...').then((m) => m.ApiService)) and await it where used. The service must be auto-provided.)
  - `src\app\core\services\Employee.service.ts:12:43` (fix: Replace inject(JwtService) with injectAsync(() => import('...').then((m) => m.JwtService)) and await it where used. The service must be auto-provided.)
  - `src\app\core\services\loading.interceptor.ts:12:61` — LoaderService is only used inside handlers. Consider injectAsync() so it loads in its own chunk on first use. (fix: Replace inject(LoaderService) with injectAsync(() => import('...').then((m) => m.LoaderService)) and await it where used. The service must be auto-provided.)
  - `src\app\core\services\login.service.ts:10:37` — ApiService is only used inside handlers. Consider injectAsync() so it loads in its own chunk on first use. (fix: Replace inject(ApiService) with injectAsync(() => import('...').then((m) => m.ApiService)) and await it where used. The service must be auto-provided.)
  - `src\app\core\services\login.service.ts:11:43` (fix: Replace inject(JwtService) with injectAsync(() => import('...').then((m) => m.JwtService)) and await it where used. The service must be auto-provided.)

## security

### angular-doctor/security-bypass (warning) — 1 occurrence

- **Message:** DomSanitizer bypass API usage requires strict review.
- **Suggested fix:** Avoid bypassing sanitization. Prefer binding safe values or server-side sanitization.
- **Reference:** https://angular.dev/best-practices/security
- **Locations:**
  - `src\app\core\pipe\safe-url.pipe.ts:9:27`

---

```json
{
  "score": 90.25,
  "totals": {
    "error": 0,
    "warning": 494,
    "info": 123,
    "byCategory": {
      "correctness": 0,
      "performance": 21,
      "maintainability": 123,
      "security": 1,
      "accessibility": 225,
      "hygiene": 247
    }
  },
  "migrationsHub": "https://angular.dev/reference/migrations",
  "styleGuideUrl": "https://angular.dev/style-guide",
  "ruleCatalogVersion": "1",
  "recommendedCommands": [
    "ng generate @angular/core:common-to-standalone",
    "ng generate @angular/core:inject",
    "ng generate @angular/core:signal-input-migration",
    "ng generate @angular/core:signal-queries-migration",
    "ng generate @angular/core:ngclass-to-class",
    "ng generate @angular/core:service"
  ]
}
```
