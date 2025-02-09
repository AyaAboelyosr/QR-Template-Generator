using Microsoft.EntityFrameworkCore;
using SimplyFairDMS.DataModels.EntityPropClasses;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace QR_Templates_Generator.Models
{
    public class QRDatabaseContext : IdentityDbContext<ApplicationUser>
    {
        public QRDatabaseContext(DbContextOptions<QRDatabaseContext> options) : base(options) { }

        public DbSet<QRTemplate> QRTemplates { get; set; }
        public DbSet<QRTemplateSection> QRTemplateSections { get; set; }
        public DbSet<QRTemplateSectionField> QRTemplateSectionFields { get; set; }
        public DbSet<QRRecord> QRRecords { get; set; }
        public DbSet<QRRecordSectionFieldValue> QRRecordsFieldValues { get; set; }



       

    }

}
