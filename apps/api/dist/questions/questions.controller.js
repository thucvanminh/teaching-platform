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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const question_dto_1 = require("./dto/question.dto");
const questions_service_1 = require("./questions.service");
let QuestionsController = class QuestionsController {
    constructor(service) {
        this.service = service;
    }
    findAll(lessonId, req) {
        return this.service.findAllForLesson(lessonId, req.user.userId, req.user.role);
    }
    findOne(id, req) {
        return this.service.findOne(id, req.user.userId, req.user.role);
    }
    create(lessonId, dto, req) {
        return this.service.create(lessonId, dto, req.user.userId);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user.userId);
    }
    remove(id, req) {
        return this.service.remove(id, req.user.userId);
    }
    getOptions(questionId, req) {
        return this.service.getOptions(questionId, req.user.userId, req.user.role);
    }
    createOption(questionId, dto, req) {
        return this.service.createOption(questionId, dto, req.user.userId);
    }
    updateOption(id, dto, req) {
        return this.service.updateOption(id, dto, req.user.userId);
    }
    removeOption(id, req) {
        return this.service.removeOption(id, req.user.userId);
    }
    reorderOptions(questionId, optionIds, req) {
        return this.service.reorderOptions(questionId, optionIds, req.user.userId);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.CreateQuestionDto, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.UpdateQuestionDto, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':questionId/options'),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "getOptions", null);
__decorate([
    (0, common_1.Post)(':questionId/options'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.CreateOptionDto, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createOption", null);
__decorate([
    (0, common_1.Put)('options/:id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.UpdateOptionDto, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "updateOption", null);
__decorate([
    (0, common_1.Delete)('options/:id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "removeOption", null);
__decorate([
    (0, common_1.Put)(':questionId/options/reorder'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "reorderOptions", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, common_1.Controller)('lessons/:lessonId/questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map