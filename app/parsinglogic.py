import pandas as pd
import uuid
import os  
from io import StringIO
import re
from datetime import datetime
import numpy as np 

def parse_text_to_excel(file_path, output_folder):
 
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    data = [line.strip().split(",") for line in lines if line.strip()]

    df = pd.DataFrame(data)

    excel_filename = f"{uuid.uuid4().hex}_parsed.xlsx"
    excel_path = os.path.join(output_folder, excel_filename)

    df.to_excel(excel_path, index=False, header=False)

    return excel_filename, excel_path



class Calculator:
    
    def __init__(self):
        pass
        
        
    def alarm(self,raw_data):
        alarms = raw_data.strip().split("\n\n")

        records = []
        for alarm in alarms:
            record = {}
            for line in alarm.split("\n"):
                if " : " in line:
                    key, value = line.split(" : ", 1)
                    record[key.strip()] = value.strip()
            records.append(record)
            
        df_alarms = pd.DataFrame(records)
        
        return df_alarms
    
    
    def sync(self,raw_data):
        
        
        sync_raw_data = raw_data[raw_data.find("NodeId"):]
        
        print(raw_data,"raw_dataraw_dataraw_data")
            
        df_sync = pd.read_csv(StringIO(sync_raw_data), sep="\t")
        
        
        return df_sync
    
    
    def file_name_maker(self,fileeee):
        
        flist = ["EUtranCellFDDId","EUtranCellTDDId","FieldReplaceableUnitId","NRCellDUId","NRSectorCarrierId","SectorCarrierId","SectorEquipmentFunctionId","syncStatus","Total number of alarms fetched for the given query"]
        
        
        for onefilename in flist:
            if(onefilename in fileeee):
                return onefilename.replace("Id","")
            
    
    def count_states(self,df, celltype):
        subset = df[df["CellType"] == celltype]
        enabled = (subset["operationalState"] == "ENABLED").sum()
        disabled = (subset["operationalState"] == "DISABLED").sum()
        return f"{enabled}/{enabled+disabled}"
    
    
    
    def count_alarms(self,df, celltype):
        
        if("presentSeverity" in df.columns):
                
            enabled = (df["presentSeverity"] == celltype).sum()
            return f"{enabled}"

        else:
            return "0"
        
    def startCalc(self,file_list,calc,get_db_connection,username):
                    
                    
                    
                    
        path = os.getcwd()
        
        
        


        def highlight_active(val):
            color = "lightgreen" if "ENABLED" in str(val) else "white"
            return f"background-color: {color}"

                
        list_of_sheet = []
        list_of_sheet_same_col = []
        list_of_sheet_name = []
        
        alarms_data = pd.DataFrame([])
        syncStatus_data = pd.DataFrame([])
        
        
        for i in file_list:
            
            name_only = os.path.splitext(os.path.basename(i))[0]
            print(i)
            
            fname = ""
            df_list = []
            with open(os.path.join(path,i)) as file:
                print(file.name," file.name()")
                
                file_data = file.read()
                fname = self.file_name_maker(file_data)
                
                name_only = fname
                
                
                if("Total number of alarms fetched for the given query" in file_data):
                    
                    alarms_data = self.alarm(file_data)
                    
                    print("alarms_dataalarms_dataalarms_data","alarms_dataalarms_data",alarms_data)
                    
                    
                if("syncStatus" in file_data):
                    
                    syncStatus_data = self.sync(file_data)
                    
                    print("syncStatus_datasyncStatus_datasyncStatus_data","alarms_dataalarms_data",syncStatus_data)
                    
                else:
                    
                    start_point = "NodeId"
                    stop_point = "instance"
                    read_enabled = False
                    
                    raw_text = ""
                    
                    raw_text_list = []
                    for j, line in enumerate(file_data.splitlines(), start=1):
                        start_matches = re.findall(start_point, line)
                        stop_matches = re.findall(stop_point, line)
                        
                        
                        if start_matches:
                            read_enabled = True
                        
                        if stop_matches:
                            read_enabled = False
                            raw_text_list.append(raw_text)
                            raw_text = ""
                            
                        if(read_enabled):
                            raw_text = raw_text+"\n"+line
                            
                        
                
                
                    for raw_one_text in raw_text_list:
                        
                        df = pd.read_csv(StringIO(raw_one_text), sep="\t")
                        
                        df_list.append(df)
                    
            
            if len(df_list) > 0:
                merged_df = pd.concat(df_list, ignore_index=True)
                
                rename_map = {
                    "EUtranCellFDD": {"col": "EUtranCellFDDId", "type": "FDD"},
                    "EUtranCellTDD": {"col": "EUtranCellTDDId", "type": "TDD"},
                    "NRCellDU": {"col": "NRCellDUId", "type": "NR"}
                }

                merged_df = pd.concat(df_list, ignore_index=True)

                print(name_only, "name_only")
                
                
                if name_only in rename_map:
                    merged_df = merged_df.rename(columns={rename_map[name_only]["col"]: "CellName"})
                    merged_df["CellType"] = rename_map[name_only]["type"]
                    print(name_only, "processed")
                    
                    list_of_sheet_same_col.append(merged_df)
                    
                    

                print(merged_df.columns)

                list_of_sheet.append(merged_df)
                
                
                list_of_sheet_name.append(fname)
            
        
        print(list_of_sheet_same_col,"list_of_sheet_same_collist_of_sheet_same_col209209209")
        
        FINAL_STATUS_df = pd.DataFrame([])
        if(len(list_of_sheet_same_col) > 0):
            sheet_same_col = pd.concat(list_of_sheet_same_col, ignore_index=True)
            final_sheet_cell = sheet_same_col[["NodeId",'CellName',"administrativeState","operationalState","CellType"]]
            list_of_sheet.insert(0, final_sheet_cell)
            list_of_sheet_name.insert(0, "CellStatus")
        
        
        
            FINAL_STATUS_df = final_sheet_cell
            
            
        
        summary_rows = []

        
        print(FINAL_STATUS_df,"FINAL_STATUS_dfFINAL_STATUS_dfFINAL_STATUS_df")
        
        if "NodeId" in FINAL_STATUS_df.columns:
            for node, group in FINAL_STATUS_df.groupby("NodeId"):
                node_alarms = pd.DataFrame([])
                if "NodeName" in alarms_data.columns:
                    node_alarms = alarms_data[alarms_data["NodeName"] == node]
                
                
                row = {
                    "NodeId": node,
                    "FDDCell": self.count_states(group, "FDD"),
                    "TDDCell": self.count_states(group, "TDD"),
                    "NRCell": self.count_states(group, "NR"),
                    # placeholders for other metrics
                    "Syncstatus": "N/A",  
                    "CriticalAlarm": self.count_alarms(node_alarms,"CRITICAL"),
                    "MajorAlarm": self.count_alarms(node_alarms,"MAJOR"),
                    "MinorAlarm": self.count_alarms(node_alarms,"MINOR"),
                    "WarningAlarm": self.count_alarms(node_alarms,"WARNING"),
                }
                summary_rows.append(row)

        summary_df = pd.DataFrame(summary_rows)
        
        print(syncStatus_data,summary_df,"syncStatus_datasyncStatus_datasyncStatus_datasyncStatus_data")
        
        if("NodeId" in syncStatus_data.columns):
                
            summary_df["Syncstatus"] = summary_df["NodeId"].map(
                syncStatus_data.set_index("NodeId")["syncStatus"]
            ).fillna("N/A")


        # print(",".join(summary_df["NodeId"].to_list()),"resultresultresultresult")
        # for node, node_df in FINAL_STATUS_df.groupby("NodeId"):
        #     print("Node:", node)
        #     for celltype, ct_df in node_df.groupby("CellType"):
        #         print("   CellType:", celltype)
        #         print(ct_df, "\n")
                
                
        list_of_sheet.insert(0, summary_df)
        list_of_sheet_name.insert(0, "NodeStatus")
        
        
        
        
        nodeIdList = []
        
        if "NodeId" in syncStatus_data.columns: 
            summary_df["NodeId"].to_list()
            
        file_list_all = ", ".join(file_list)
                
                
        print(list_of_sheet_name,"list_of_sheet_namelist_of_sheet_name")
        file_name = calc+datetime.now().strftime("%d_%m_%Y_%H_%M_%S") + "_cells_data_temp.xlsx"
        with pd.ExcelWriter(os.path.join("downloads",file_name), engine="xlsxwriter") as writer:
            
            for i, df in enumerate(list_of_sheet, start=1):
                name_only = list_of_sheet_name[i-1]
                
                sheet_name = f"{name_only}"   # You can also use custom names
                df.to_excel(writer, index=False, sheet_name=sheet_name)
                workbook  = writer.book
                worksheet = writer.sheets[sheet_name]

                enableformat1 = workbook.add_format({'bg_color': 'gray'})

                disableformat1 = workbook.add_format({'bg_color': 'red'})
                
                print(df.columns,"df.columnsdf.columns")
                # col_idx = df.columns.get_loc("operationalState")
                start_row = 1 
                stop_row = len(df)
                
                
                for liei in ["operationalState","operationalState_pre","operationalState_post","administrativeState_pre","administrativeState_post","Syncstatus"]:
                    
                    print(df.columns,"df.columnsdf.columnsdf.columns137137137")    
                    if liei in df.columns:

                        col_idx = df.columns.get_loc(liei)
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'ENABLED',
                            'format': disableformat1
                        })
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'DISABLED',
                            'format': enableformat1
                        })
                
                
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'UNLOCKED',
                            'format': disableformat1
                        })
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'LOCKED',
                            'format': enableformat1
                        })
                        
                        
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'SYNCHRONIZED',
                            'format': enableformat1
                        })
                        
                        
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'NOT SYNCHRONIZED',
                            'format': disableformat1
                        })
            

        return {
            "file_name_all":os.path.join("downloads",file_name),
            "file_all":file_name,
            "nodeIdList":nodeIdList
        }
    
    
    def alarm_check(self,files):
                    
                    
        path = os.getcwd()


        def highlight_active(val):
            color = "lightgreen" if "ENABLED" in str(val) else "white"
            return f"background-color: {color}"

                
        list_of_sheet = []
        list_of_sheet_same_col = []
        list_of_sheet_name = []
        for i in files:
            
            
            name_only = os.path.splitext(os.path.basename(i))[0]
            print(i)
            
            df_list = []
            with open(os.path.join(path,i)) as file:
                print(file.name," file.name()")
                file_data = file.read()
                start_point = "presentSeverity"
                stop_point = "Total number"
                read_enabled = False
                
                raw_text = ""
                
                raw_text_list = []
                for j, line in enumerate(file_data.splitlines(), start=1):
                    start_matches = re.findall(start_point, line)
                    stop_matches = re.findall(stop_point, line)
                    
                    
                    print(start_matches,"start_matches","stop_matches")
                    if start_matches:
                        read_enabled = True
                    
                    if stop_matches:
                        read_enabled = False
                        raw_text_list.append(raw_text)
                        raw_text = ""
                        
                    if(read_enabled):
                        raw_text = raw_text+"\n"+line
                        
                    
            
                for raw_one_text in raw_text_list:    
                
                
                    df = pd.read_csv(StringIO(raw_one_text), sep="\t")
                    
                    
                    for i in df.iterrows():
                        print(i["NodeName"],"sadmnasjdnasndsajdkjasdnsajkdjkas")
                     
                    
                    # filtered_data = df[
                    #     ~df["presentSeverity"].str.contains("Cell UserLabel", na=False) &
                    #     ~df["presentSeverity"].str.contains("EUtranCell", na=False)
                    # ]
                    
                    df_list.append(df)
                    
                    
                 
            print(df_list,"df_listdf_listdf_listdf_list")
            merged_df = pd.concat(df_list, ignore_index=True)
            
            rename_map = {
                "EutrancellFDD": {"col": "EUtranCellFDDId", "type": "FDD"},
                "EutrancellTDD": {"col": "EUtranCellTDDId", "type": "TDD"},
                "FieldReplaceableUnit": {"col": "FieldReplaceableUnitId", "type": "NR"}
            }
            
            print(df_list,"df_listdf_listdf_listdf_list")

            merged_df = pd.concat(df_list, ignore_index=True)

            print(name_only, "name_only")
            
            
            if name_only in rename_map:
                merged_df = merged_df.rename(columns={rename_map[name_only]["col"]: "CellName"})
                merged_df["CellType"] = rename_map[name_only]["type"]
                print(name_only, "processed")
                
                list_of_sheet_same_col.append(merged_df)
                
            
                

            print(merged_df.columns)

            list_of_sheet.append(merged_df)
            list_of_sheet_name.append(name_only)
            
            
            
        print(len(list_of_sheet),"list_of_sheetlist_of_sheet")
        file_name = "alarmsss"+datetime.now().strftime("%d_%m_%Y_%H_%M_%S") + "_cells_data_temp.xlsx"
        with pd.ExcelWriter(os.path.join("downloads",file_name), engine="xlsxwriter") as writer:
            
            for i, df in enumerate(list_of_sheet, start=1):
                name_only = list_of_sheet_name[i-1]
                
                sheet_name = f"{name_only}"   # You can also use custom names
                df.to_excel(writer, index=False, sheet_name=sheet_name)
                workbook  = writer.book
                worksheet = writer.sheets[sheet_name]

                enableformat1 = workbook.add_format({'bg_color': 'gray'})

                disableformat1 = workbook.add_format({'bg_color': 'red'})
                
                print(df.columns,"df.columnsdf.columns")
                # col_idx = df.columns.get_loc("operationalState")
                # start_row = 1 
                # stop_row = len(df)
                # worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                #     'type': 'text',
                #     'criteria': 'containing',
                #     'value': 'ENABLED',
                #     'format': disableformat1
                # })
                # worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                #     'type': 'text',
                #     'criteria': 'containing',
                #     'value': 'DISABLED',
                #     'format': enableformat1
                # })
            
        

        return os.path.join("downloads",file_name)
    
    
    
    

    
    def startdiffCalc(self,pre_files,post_files):
        print(pre_files,post_files,"pre_files,post_filespre_files,post_files")
                

        pre_df = pd.read_excel(pre_files,sheet_name="CellStatus")
        post_df = pd.read_excel(post_files,sheet_name="CellStatus")
        
        
        print(pre_df,post_df,"pre_df,post_dfpre_df,post_dfpre_df,post_dfpre_df,post_df")
        
        
        
        
        pre_df["merged_data"] = pre_df["NodeId"].astype(str) + "_" + pre_df["CellType"].astype(str) + "_" + pre_df["CellName"].astype(str)
        post_df["merged_data"] = post_df["NodeId"].astype(str) + "_" + post_df["CellType"].astype(str) + "_" + post_df["CellName"].astype(str)
        # pre_df["operationalStatePre"] = pre_df["operationalState"]
        # post_df["operationalStatePost"] = post_df["operationalState"]
        # pre_df["administrativeStatePre"] = pre_df["administrativeState"]
        # post_df["administrativeStatePost"] = post_df["administrativeState"]
        
        
        print(pre_df["merged_data"].to_string())
        print(post_df["merged_data"].to_string())
        
        
        
        print(pre_df.keys())
        print(post_df.keys())
        
        merged = pre_df.merge(post_df, on=["merged_data"], how="outer",indicator=True,suffixes=("_pre", "_post"))
        
        
        filtered_data = merged[(merged["operationalState_pre"] != merged["operationalState_post"]) | (merged["_merge"] != "both")]
        
                
        filtered_data["status"] = np.where(
            filtered_data["_merge"] == "both", 
            "Status Changes", 
            np.where(
                filtered_data["_merge"] == "left_only", 
                "Missing in post check", 
                "Missing in pre check"
            )
        )
        
        filtered_data["NodeId"] = filtered_data["NodeId_pre"].combine_first(filtered_data["NodeId_post"])
        filtered_data["CellType"] = filtered_data["CellType_pre"].combine_first(filtered_data["CellType_post"])
        filtered_data["CellName"] = filtered_data["CellName_pre"].combine_first(filtered_data["CellName_post"])

        filtered_data = filtered_data[["NodeId","CellType","CellName","operationalState_pre","administrativeState_pre","operationalState_post","administrativeState_post","status"]]
        
        
        

        with pd.ExcelWriter(post_files, engine="openpyxl", mode="a", if_sheet_exists="new") as writer:
            filtered_data.to_excel(writer, sheet_name="Final_Status", index=False)
            
        
        all_sheets = pd.read_excel(post_files, sheet_name=None)
            
        list_of_sheet_name = list(all_sheets.keys())   # sheet names
        list_of_sheet = list(all_sheets.values())
        
        
        if "Final_Status" in list_of_sheet_name:
            idx = list_of_sheet_name.index("Final_Status")
            # pop out the sheet
            fs_name = list_of_sheet_name.pop(idx)
            fs_df = list_of_sheet.pop(idx)
            # insert at position 0
            list_of_sheet_name.insert(0, fs_name)
            list_of_sheet.insert(0, fs_df)
        
        with pd.ExcelWriter(post_files, engine="xlsxwriter") as writer:
            
            for i, df in enumerate(list_of_sheet, start=1):
                name_only = list_of_sheet_name[i-1]
                
                sheet_name = f"{name_only}"   # You can also use custom names
                df.to_excel(writer, index=False, sheet_name=sheet_name)
                workbook  = writer.book
                worksheet = writer.sheets[sheet_name]

                enableformat1 = workbook.add_format({'bg_color': 'gray'})

                disableformat1 = workbook.add_format({'bg_color': 'red'})
                
                print(df.columns,"df.columnsdf.columns")
                # col_idx = df.columns.get_loc("operationalState")
                start_row = 1 
                stop_row = len(df)
                
                
                for liei in ["operationalState","operationalState_pre","operationalState_post","administrativeState_pre","administrativeState_post"]:
                    
                    print(df.columns,"df.columnsdf.columnsdf.columns137137137")    
                    if liei in df.columns:

                        col_idx = df.columns.get_loc(liei)
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'ENABLED',
                            'format': disableformat1
                        })
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'DISABLED',
                            'format': enableformat1
                        })
                
                
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'UNLOCKED',
                            'format': disableformat1
                        })
                        worksheet.conditional_format(start_row, col_idx, stop_row, col_idx, {
                            'type': 'text',
                            'criteria': 'containing',
                            'value': 'LOCKED',
                            'format': enableformat1
                        })
            
            
            
            
        
        print(filtered_data.to_csv("sdasdasdasdasdasd987s.csv"))
        
        