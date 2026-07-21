-- Baseline: matches the schema Hibernate ddl-auto=update had already produced in production,
-- verified against a scratch ddl-auto=create run before being committed.

CREATE TABLE `task` (
  `id` bigint NOT NULL,
  `assigned_user_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deadline` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `task_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ddl-auto=create normally seeds this itself; Flyway-created tables need it done explicitly
-- or Hibernate's hi/lo generator fails with "could not read a hi value"
INSERT INTO `task_seq` VALUES (1);

CREATE TABLE `task_tags` (
  `task_id` bigint NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  KEY `FK5jrufop0gtxfeybb27jkoqn9r` (`task_id`),
  CONSTRAINT `FK5jrufop0gtxfeybb27jkoqn9r` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
