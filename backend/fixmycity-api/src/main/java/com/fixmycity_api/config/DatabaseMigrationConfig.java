package com.fixmycity_api.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrationConfig.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void migrateColumns() {
        alterColumnToText("issues", "image_url");
        alterColumnToText("issues", "proof_image");
        alterColumnToText("issues", "resolution_note");
    }

    private void alterColumnToText(String table, String column) {
        try {
            String currentType = jdbcTemplate.queryForObject(
                "SELECT data_type FROM information_schema.columns " +
                "WHERE table_name = ? AND column_name = ?",
                String.class, table, column
            );
            if (currentType != null && !currentType.equalsIgnoreCase("text")) {
                jdbcTemplate.execute(
                    "ALTER TABLE " + table + " ALTER COLUMN " + column + " TYPE TEXT"
                );
                log.info("Migrated {}.{} from {} to TEXT", table, column, currentType);
            }
        } catch (Exception e) {
            log.warn("Could not migrate {}.{}: {}", table, column, e.getMessage());
        }
    }
}
