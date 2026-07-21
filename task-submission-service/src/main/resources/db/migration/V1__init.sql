-- Baseline: matches the schema Hibernate ddl-auto=update had already produced in production,
-- verified against a scratch ddl-auto=create run before being committed.

CREATE TABLE `submission` (
  `id` bigint NOT NULL,
  `github_link` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `submission_time` datetime(6) DEFAULT NULL,
  `task_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `submission_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ddl-auto=create normally seeds this itself; Flyway-created tables need it done explicitly
-- or Hibernate's hi/lo generator fails with "could not read a hi value"
INSERT INTO `submission_seq` VALUES (1);
