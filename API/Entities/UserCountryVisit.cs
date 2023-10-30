using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class UserCountryVisit
    {
        [Key]
        public int VisitId { get; set; }

        [ForeignKey(name: "User")]
        public Guid UserId { get; set; }
        public User User { get; set; }

        [ForeignKey(name: "Country")]
        public int CountryId { get; set; }
        public Country Country { get; set; }

        public DateTime DateVisited { get; set; }
    }
}
