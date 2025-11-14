using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentPortfolio.API.Migrations
{
    /// <inheritdoc />
    public partial class sp01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "end_date",
                table: "students",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "end_date",
                table: "students");
        }
    }
}
