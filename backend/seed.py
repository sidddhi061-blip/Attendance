from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
from datetime import date, datetime

def seed():
    db = SessionLocal()
    try:
        # Check if employees already exist
        if db.query(models.Employee).count() > 0:
            print("Database already seeded.")
            return

        # Add sample employees
        emp1 = models.Employee(
            employee_id="EMP001",
            full_name="John Doe",
            email="john.doe@example.com",
            department="Engineering",
            position="Senior Software Engineer",
            phone="1234567890"
        )
        emp2 = models.Employee(
            employee_id="EMP002",
            full_name="Jane Smith",
            email="jane.smith@example.com",
            department="Product",
            position="Product Manager",
            phone="0987654321"
        )
        emp3 = models.Employee(
            employee_id="EMP003",
            full_name="Bob Wilson",
            email="bob.wilson@example.com",
            department="Design",
            position="UI/UX Designer",
            phone="1122334455"
        )
        db.add_all([emp1, emp2, emp3])
        db.commit()

        # Add sample attendance records for today
        today = date.today()
        att1 = models.Attendance(
            employee_id=emp1.id,
            date=today,
            status="Present",
            note="Regular check-in"
        )
        att2 = models.Attendance(
            employee_id=emp2.id,
            date=today,
            status="Late",
            note="Stuck in traffic"
        )
        att3 = models.Attendance(
            employee_id=emp3.id,
            date=today,
            status="Absent",
            note="On sick leave"
        )
        db.add_all([att1, att2, att3])
        db.commit()
        print("Database seeded successfully with 3 employees and 3 attendance records.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
