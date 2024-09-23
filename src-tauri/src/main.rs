// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

fn main() {
  let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, name TEXT);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_price_codes_table",
            sql: "CREATE TABLE IF NOT EXISTS price_codes (id INTEGER PRIMARY KEY, code TEXT, currency TEXT, cost_per_hour REAL);",
            kind: MigrationKind::Up,
        }
    ];



  println!("migrations complete!");
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .plugin(Builder::default().add_migrations("sqlite:mydatabase.db", migrations).build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");




}
