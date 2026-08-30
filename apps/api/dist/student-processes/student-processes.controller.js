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
exports.StudentProcessesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const assign_process_dto_1 = require("./dto/assign-process.dto");
const student_processes_service_1 = require("./student-processes.service");
let StudentProcessesController = class StudentProcessesController {
    constructor(service) {
        this.service = service;
    }
    findAll(req) {
        return this.service.findAllForUser(req.user.userId, req.user.role);
    }
    getStudents() {
        return this.service.getStudents();
    }
    assign(dto, req) {
        return this.service.assign(dto, req.user.userId);
    }
    unassign(id, req) {
        return this.service.unassign(id, req.user.userId);
    }
};
exports.StudentProcessesController = StudentProcessesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentProcessesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('students'),
    (0, roles_decorator_1.Roles)('teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentProcessesController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_process_dto_1.AssignProcessDto, Object]),
    __metadata("design:returntype", void 0)
], StudentProcessesController.prototype, "assign", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentProcessesController.prototype, "unassign", null);
exports.StudentProcessesController = StudentProcessesController = __decorate([
    (0, common_1.Controller)('student-processes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [student_processes_service_1.StudentProcessesService])
], StudentProcessesController);
//# sourceMappingURL=student-processes.controller.js.map