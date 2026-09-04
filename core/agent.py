import os
import datetime

print("""
=========================
   VirgoYT Hermes AI
=========================
""")

skills=os.path.expanduser("~/.hermes/skills")

print("Loaded Skills:")

if os.path.exists(skills):
    for skill in os.listdir(skills):
        print(" ✓", skill)

print("\nVirgoYT Hermes Ready!")

while True:
    user=input("\nYou: ")

    if user.lower() in ["exit","quit"]:
        break

    if user.lower()=="time":
        print(datetime.datetime.now())
    else:
        print("VirgoYT Hermes:", user)
