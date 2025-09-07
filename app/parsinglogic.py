import pandas as pd
import uuid
import os   

def parse_text_to_excel(file_path, output_folder):
 
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    data = [line.strip().split(",") for line in lines if line.strip()]

    df = pd.DataFrame(data)

    excel_filename = f"{uuid.uuid4().hex}_parsed.xlsx"
    excel_path = os.path.join(output_folder, excel_filename)

    df.to_excel(excel_path, index=False, header=False)

    return excel_filename, excel_path