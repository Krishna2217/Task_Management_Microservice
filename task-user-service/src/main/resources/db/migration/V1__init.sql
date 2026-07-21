-- Baseline: matches the schema Hibernate ddl-auto=update had already produced in production,
-- verified against a scratch ddl-auto=create run before being committed.

CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ddl-auto=create normally seeds this itself; Flyway-created tables need it done explicitly
-- or Hibernate's hi/lo generator fails with "could not read a hi value"
INSERT INTO `user_seq` VALUES (1);

CREATE TABLE `role_change_request` (
  `id` bigint NOT NULL,
  `current_role` varchar(255) DEFAULT NULL,
  `requested_at` datetime(6) DEFAULT NULL,
  `requested_role` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role_change_request_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `role_change_request_seq` VALUES (1);
