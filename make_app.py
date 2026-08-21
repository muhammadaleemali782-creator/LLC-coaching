import os

def create_files():
    os.makedirs('src/types', exist_ok=True)
    os.makedirs('src/data', exist_ok=True)
    os.makedirs('src/context', exist_ok=True)
    os.makedirs('src/components/modals', exist_ok=True)
    os.makedirs('src/components/student', exist_ok=True)
    os.makedirs('src/components/admin', exist_ok=True)
    print('Directories created successfully.')

create_files()
