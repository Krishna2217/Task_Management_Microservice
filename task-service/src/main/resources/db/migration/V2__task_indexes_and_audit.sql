-- created_at already exists from V1 (Task's own field, now backed by Auditable/@CreatedDate instead
-- of the manual task.setCreatedAt() call); only updated_at and the created_by/updated_by columns are new.
ALTER TABLE `task` ADD COLUMN updated_at DATETIME(6) NULL;
ALTER TABLE `task` ADD COLUMN created_by BIGINT NULL;
ALTER TABLE `task` ADD COLUMN updated_by BIGINT NULL;
UPDATE `task` SET updated_at = COALESCE(created_at, CURRENT_TIMESTAMP(6)) WHERE updated_at IS NULL;
ALTER TABLE `task` MODIFY updated_at DATETIME(6) NOT NULL;

CREATE INDEX idx_task_assigned_user ON `task` (assigned_user_id);
CREATE INDEX idx_task_status ON `task` (status);
CREATE INDEX idx_task_deadline ON `task` (deadline);

-- task_tags was already created correctly in V1 (id-less join table: task_id FK + tag varchar(255));
-- Phase 0's ElementCollection fix predates Flyway, so there is nothing to add here.
