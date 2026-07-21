-- normalize old verb-form values (the app used to store "ACCEPT"/"DECLINE" verbatim) before
-- converting the column to an ENUM restricted to the three real states
UPDATE `submission` SET status = 'ACCEPTED' WHERE status = 'ACCEPT';
UPDATE `submission` SET status = 'DECLINED' WHERE status = 'DECLINE';

ALTER TABLE `submission` MODIFY status ENUM('PENDING','ACCEPTED','DECLINED') NOT NULL DEFAULT 'PENDING';

CREATE INDEX idx_submission_task ON `submission` (task_id);
CREATE INDEX idx_submission_user ON `submission` (user_id);
CREATE INDEX idx_submission_status ON `submission` (status);

ALTER TABLE `submission` ADD COLUMN created_at DATETIME(6) NULL;
ALTER TABLE `submission` ADD COLUMN updated_at DATETIME(6) NULL;
ALTER TABLE `submission` ADD COLUMN created_by BIGINT NULL;
ALTER TABLE `submission` ADD COLUMN updated_by BIGINT NULL;
UPDATE `submission` SET created_at = COALESCE(submission_time, CURRENT_TIMESTAMP(6)) WHERE created_at IS NULL;
UPDATE `submission` SET updated_at = created_at WHERE updated_at IS NULL;
ALTER TABLE `submission` MODIFY created_at DATETIME(6) NOT NULL;
ALTER TABLE `submission` MODIFY updated_at DATETIME(6) NOT NULL;
