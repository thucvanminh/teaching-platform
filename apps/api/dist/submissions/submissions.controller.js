"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const submission_dto_1 = require("./dto/submission.dto");
const submissions_service_1 = require("./submissions.service");
let SubmissionsController = class SubmissionsController {
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.createSubmission(dto, req.user.userId);
    }
    grade(id, dto, req) {
        return this.service.gradeSubmission(id, dto, req.user.userId);
    }
    review(id, req) {
        return this.service.getSubmissionReview(id, req.user.userId, req.user.role);
    }
    history(lessonId, req) {
        return this.service.getSubmissionHistory(lessonId, req.user.userId);
    }
    teacherSubmissions(lessonId, req) {
        return this.service.getSubmissionsForTeacher(lessonId, req.user.userId);
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('student'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submission_dto_1.CreateSubmissionDto, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/grade'),
    (0, roles_decorator_1.Roles)('student'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submission_dto_1.GradeSubmissionDto, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "grade", null);
__decorate([
    (0, common_1.Get)(':id/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "review", null);
__decorate([
    (0, common_1.Get)('history/:lessonId'),
    (0, roles_decorator_1.Roles)('student'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "history", null);
__decorate([
    (0, common_1.Get)('teacher/:lessonId'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "teacherSubmissions", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.Controller)('submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map