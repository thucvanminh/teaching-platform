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
exports.ThemesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const theme_dto_1 = require("./dto/theme.dto");
const lesson_dto_1 = require("../lessons/dto/lesson.dto");
const themes_service_1 = require("./themes.service");
const lessons_service_1 = require("../lessons/lessons.service");
let ThemesController = class ThemesController {
    constructor(themesService, lessonsService) {
        this.themesService = themesService;
        this.lessonsService = lessonsService;
    }
    findAllThemes(processId, req) {
        return this.themesService.findAllForProcess(processId, req.user.userId, req.user.role);
    }
    findOneTheme(id, req) {
        return this.themesService.findOne(id, req.user.userId, req.user.role);
    }
    createTheme(processId, dto, req) {
        return this.themesService.create(processId, dto, req.user.userId);
    }
    updateTheme(id, dto, req) {
        return this.themesService.update(id, dto, req.user.userId);
    }
    removeTheme(id, req) {
        return this.themesService.remove(id, req.user.userId);
    }
    reorderThemes(processId, themeIds, req) {
        return this.themesService.reorder(processId, themeIds, req.user.userId);
    }
    findAllLessons(themeId, req) {
        return this.lessonsService.findAllForTheme(themeId, req.user.userId, req.user.role);
    }
    findOneLesson(lessonId, req) {
        return this.lessonsService.findOne(lessonId, req.user.userId, req.user.role);
    }
    createLesson(processId, themeId, dto, req) {
        return this.lessonsService.createForTheme(themeId, dto, req.user.userId);
    }
    updateLesson(lessonId, dto, req) {
        return this.lessonsService.update(lessonId, dto, req.user.userId);
    }
    removeLesson(lessonId, req) {
        return this.lessonsService.remove(lessonId, req.user.userId);
    }
};
exports.ThemesController = ThemesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "findAllThemes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "findOneTheme", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, theme_dto_1.CreateThemeDto, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "createTheme", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, theme_dto_1.UpdateThemeDto, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "updateTheme", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "removeTheme", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "reorderThemes", null);
__decorate([
    (0, common_1.Get)(':themeId/lessons'),
    __param(0, (0, common_1.Param)('themeId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "findAllLessons", null);
__decorate([
    (0, common_1.Get)(':themeId/lessons/:lessonId'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "findOneLesson", null);
__decorate([
    (0, common_1.Post)(':themeId/lessons'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('processId')),
    __param(1, (0, common_1.Param)('themeId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, lesson_dto_1.CreateLessonDto, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Put)(':themeId/lessons/:lessonId'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lesson_dto_1.UpdateLessonDto, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "updateLesson", null);
__decorate([
    (0, common_1.Delete)(':themeId/lessons/:lessonId'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "removeLesson", null);
exports.ThemesController = ThemesController = __decorate([
    (0, common_1.Controller)('processes/:processId/themes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [themes_service_1.ThemesService,
        lessons_service_1.LessonsService])
], ThemesController);
//# sourceMappingURL=themes.controller.js.map