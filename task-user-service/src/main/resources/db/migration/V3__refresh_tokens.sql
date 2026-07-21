CREATE TABLE `refresh_token` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `token_hash` varchar(255) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `revoked` bit(1) NOT NULL DEFAULT b'0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX uk_refresh_token_hash ON `refresh_token` (token_hash);
CREATE INDEX idx_refresh_token_user ON `refresh_token` (user_id);

CREATE TABLE `refresh_token_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ddl-auto=create normally seeds this itself; Flyway-created tables need it done explicitly
-- or Hibernate's hi/lo generator fails with "could not read a hi value"
INSERT INTO `refresh_token_seq` VALUES (1);
