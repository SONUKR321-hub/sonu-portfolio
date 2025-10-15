# Let me extract the resume data and create a structured profile
resume_data = {
    "personal_info": {
        "name": "Sonu Kumar",
        "email": "rsidharth351@gmail.com",
        "linkedin": "www.linkedin.com/in/sonu-kumar-94b23020b",
        "github": "https://github.com/SONUKR321-hub",
        "location": "Nawada, Bihar, India",
        "title": "Top 15 Finalist – Google Cloud Agentic Hackathon | Data Science & Full-Stack Development Enthusiast | AI & Cloud Innovator | JEE Mentor"
    },
    "summary": "Hello! I'm Sonu Kumar, a committed student of Data science who is passionate about using data to solve issues and extract insights. In addition to my studies in data science, I'm delving into the fascinating field of full-stack development to apply my imagination to create websites that are both powerful and easy to use.",
    "top_skills": [
        "Computer Science",
        "Artificial Intelligence (AI)", 
        "Machine Learning"
    ],
    "experience": [
        {
            "company": "Superprof",
            "position": "Education Mentor",
            "duration": "February 2025 - Present (9 months)",
            "description": "Passionate JEE Tutor | Physics, Chemistry & Maths. I help students crack JEE Main & Advanced with clear concepts, smart problem-solving techniques, and personalized strategies."
        },
        {
            "company": "Pichavaram House, IIT Madras",
            "position": "Member",
            "duration": "May 2024 - Present (1 year 6 months)",
            "description": ""
        },
        {
            "company": "E-Cell, IIT Bombay",
            "position": "Campus Ambassador",
            "duration": "July 2024 - December 2024 (6 months)",
            "location": "Mumbai, Maharashtra, India",
            "description": ""
        },
        {
            "company": "Jamsetji Tata Society for Innovation and Entrepreneurship (JITSIE), IIT Madras",
            "position": "Investor Relations Assistant",
            "duration": "August 2024 - November 2024 (4 months)",
            "location": "Chennai, Tamil Nadu, India",
            "description": ""
        }
    ],
    "education": [
        {
            "institution": "Muzaffarpur Institute of Technology",
            "degree": "Bachelor of Technology - BTech, Civil Engineering",
            "duration": "August 2024 - July 2028"
        },
        {
            "institution": "Indian Institute of Technology, Madras",
            "degree": "Bachelor of Science - BS, DATA SCIENCE AND APPLICATION",
            "duration": "May 2024 - May 2028"
        },
        {
            "institution": "KLS COLLEGE",
            "degree": "12, INTERMEDIATE IN PCM",
            "duration": "March 2021 - March 2023"
        },
        {
            "institution": "St. Joseph's school",
            "degree": "10, Matriculation",
            "duration": "2011 - 2021"
        }
    ]
}

# Create projects data structure from resume and achievements
projects_data = [
    {
        "name": "Google Cloud Agentic Hackathon Project",
        "description": "Top 15 Finalist project showcasing AI and cloud innovation capabilities",
        "tech_stack": ["Google Cloud", "AI/ML", "Agentic AI"],
        "achievement": "Top 15 Finalist",
        "category": "AI/ML"
    },
    {
        "name": "Full-Stack Development Projects",
        "description": "Powerful and user-friendly websites combining data science insights with web development",
        "tech_stack": ["Full Stack", "Data Science", "Web Development"],
        "category": "Web Development"
    },
    {
        "name": "Data Science Applications",
        "description": "Projects focused on solving issues and extracting insights from data",
        "tech_stack": ["Python", "Data Science", "Machine Learning"],
        "category": "Data Science"
    },
    {
        "name": "JEE Mentoring Platform",
        "description": "Educational platform helping students with JEE preparation through clear concepts and problem-solving techniques",
        "tech_stack": ["Education Technology", "Physics", "Chemistry", "Mathematics"],
        "category": "Education"
    }
]

print("Resume data extracted successfully!")
print(f"Name: {resume_data['personal_info']['name']}")
print(f"Title: {resume_data['personal_info']['title']}")
print(f"Skills: {', '.join(resume_data['top_skills'])}")
print(f"Experience entries: {len(resume_data['experience'])}")
print(f"Education entries: {len(resume_data['education'])}")
print(f"Project categories: {len(projects_data)}")