from flask import Blueprint, request, jsonify
from datetime import datetime

fir_bp = Blueprint('fir', __name__)

@fir_bp.route('/generate-fir', methods=['POST'])
def generate_fir():
    data = request.get_json(force=True)

    # Extract fields
    complainant_name = data.get('complainant_name', '').strip()
    incident_description = data.get('incident_description', '').strip()
    incident_date = data.get('incident_date', '').strip()
    incident_location = data.get('incident_location', '').strip()
    crime_type = data.get('crime_type', '').strip()
    accused_name = data.get('accused_name', 'Unknown').strip()

    # Validate required fields
    if not all([complainant_name, incident_description, incident_date, incident_location, crime_type]):
        return jsonify({
            "error": "Fields required: complainant_name, incident_description, incident_date, incident_location, crime_type"
        }), 400

    # Legal sections mapping
    sections_map = {
        "murder"     : "IPC Section 302",
        "theft"      : "IPC Section 379",
        "assault"    : "IPC Section 351",
        "robbery"    : "IPC Section 392",
        "kidnapping" : "IPC Section 363",
        "fraud"      : "IPC Section 420",
        "harassment" : "IPC Section 354",
        "rape"       : "IPC Section 376",
    }

    # Find matching section
    ipc_section = "IPC Section 420 (General)"
    for key, val in sections_map.items():
        if key in crime_type.lower():
            ipc_section = val
            break

    # Generate FIR number
    fir_number = f"FIR-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    filed_date = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    # Generate FIR draft
    fir_draft = f"""
====================================================
            FIRST INFORMATION REPORT (FIR)
====================================================
FIR Number       : {fir_number}
Date & Time      : {filed_date}
----------------------------------------------------
COMPLAINANT DETAILS
Name             : {complainant_name}
----------------------------------------------------
INCIDENT DETAILS
Date of Incident : {incident_date}
Location         : {incident_location}
Crime Type       : {crime_type}
Accused Name     : {accused_name}
Applicable Law   : {ipc_section}
----------------------------------------------------
DESCRIPTION
{incident_description}
----------------------------------------------------
This FIR is filed based on the complainant's statement.
Investigation will follow as per law.
====================================================
    """.strip()

    return jsonify({
        "fir_number": fir_number,
        "filed_date": filed_date,
        "complainant_name": complainant_name,
        "crime_type": crime_type,
        "ipc_section": ipc_section,
        "accused_name": accused_name,
        "fir_draft": fir_draft,
        "status": "DRAFT"
    })