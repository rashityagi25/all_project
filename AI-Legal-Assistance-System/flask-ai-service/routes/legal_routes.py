from flask import Blueprint, request, jsonify

legal_bp = Blueprint('legal', __name__)

# Legal sections database
LEGAL_SECTIONS = {
    "murder": {
        "sections": ["IPC Section 302", "IPC Section 300"],
        "description": "Punishment for murder — death or life imprisonment with fine.",
        "bail": "Non-bailable"
    },
    "theft": {
        "sections": ["IPC Section 379", "IPC Section 380"],
        "description": "Punishment for theft — imprisonment up to 3 years with fine.",
        "bail": "Bailable"
    },
    "assault": {
        "sections": ["IPC Section 351", "IPC Section 352"],
        "description": "Punishment for assault — imprisonment up to 3 months with fine.",
        "bail": "Bailable"
    },
    "robbery": {
        "sections": ["IPC Section 390", "IPC Section 392"],
        "description": "Punishment for robbery — rigorous imprisonment up to 10 years with fine.",
        "bail": "Non-bailable"
    },
    "kidnapping": {
        "sections": ["IPC Section 359", "IPC Section 363"],
        "description": "Punishment for kidnapping — imprisonment up to 7 years with fine.",
        "bail": "Non-bailable"
    },
    "fraud": {
        "sections": ["IPC Section 420", "IPC Section 415"],
        "description": "Punishment for cheating and fraud — imprisonment up to 7 years with fine.",
        "bail": "Bailable"
    },
    "harassment": {
        "sections": ["IPC Section 354", "IPC Section 509"],
        "description": "Punishment for harassment — imprisonment up to 3 years with fine.",
        "bail": "Bailable"
    },
    "rape": {
        "sections": ["IPC Section 375", "IPC Section 376"],
        "description": "Punishment for rape — rigorous imprisonment not less than 10 years.",
        "bail": "Non-bailable"
    },
    "cybercrime": {
        "sections": ["IT Act Section 66", "IT Act Section 67"],
        "description": "Punishment for cybercrime — imprisonment up to 3 years with fine.",
        "bail": "Bailable"
    }
}

# Chat responses
CHAT_RESPONSES = {
    "fir": "FIR (First Information Report) file karne ke liye nearest police station jaao. Apni ID proof aur incident details saath rakho. Aap online bhi file kar sakte ho is system ke through.",
    "police": "Police helpline: 100. Aap seedha police station ja sakte ho ya online complaint file kar sakte ho.",
    "lawyer": "Legal aid ke liye 15100 par call karo. NALSA (National Legal Services Authority) free legal help deta hai. Number hai: 1800-200-5800",
    "bail": "Bail ke liye court mein application deni hoti hai. Non-bailable offenses mein High Court ya Sessions Court se bail milti hai.",
    "evidence": "Evidence preserve karo — photos, videos, witnesses ke naam aur contact numbers. Tamper mat karo kisi bhi evidence ke saath.",
    "complaint": "Complaint file karne ke liye 'File Complaint' section mein jaao. Title, description aur location fill karo. AI automatically FIR draft kar dega.",
    "helpline": "Emergency helplines:\n- Police: 100\n- Ambulance: 108\n- Women: 1091\n- Cyber Crime: 1930\n- Legal Aid: 15100",
    "women": "Women safety ke liye:\n- Women Helpline: 1091\n- Domestic Violence: 181\n- NCW: 7827170170\n- Police: 100",
    "cyber": "Cybercrime report karne ke liye:\n- Helpline: 1930\n- Website: cybercrime.gov.in\n- IT Act Section 66 apply hoga",
    "ipc": "IPC (Indian Penal Code) mein crimes ke liye punishments defined hain. Aap kaunse crime ke baare mein jaanna chahte ho?",
}

@legal_bp.route('/legal-advice', methods=['POST'])
def legal_advice():
    data = request.get_json(force=True)
    crime_type = data.get('crime_type', '').lower().strip()

    if not crime_type:
        return jsonify({"error": "Field 'crime_type' is required"}), 400

    matched = None
    matched_key = None
    for key in LEGAL_SECTIONS:
        if key in crime_type or crime_type in key:
            matched = LEGAL_SECTIONS[key]
            matched_key = key
            break

    if not matched:
        return jsonify({
            "crime_type": crime_type,
            "message": "No specific legal section found. Please consult a lawyer.",
            "helpline": "Police: 100 | Legal Aid: 15100"
        }), 404

    return jsonify({
        "crime_type": matched_key,
        "sections": matched["sections"],
        "description": matched["description"],
        "bail_status": matched["bail"],
        "advice": f"File an FIR at your nearest police station under {', '.join(matched['sections'])}.",
        "helpline": "Police: 100 | Women Helpline: 1091 | Legal Aid: 15100"
    })

@legal_bp.route('/legal-advice/all', methods=['GET'])
def all_sections():
    return jsonify({
        "total": len(LEGAL_SECTIONS),
        "crimes": list(LEGAL_SECTIONS.keys())
    })

@legal_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(force=True)
    message = data.get('message', '').lower().strip()

    if not message:
        return jsonify({"error": "Message is required"}), 400

    # Find best response
    response = None
    for key, value in CHAT_RESPONSES.items():
        if key in message:
            response = value
            break

    # Check crime types
    if not response:
        for key, value in LEGAL_SECTIONS.items():
            if key in message:
                response = f"**{key.upper()}** ke baare mein:\n\n"
                response += f"📋 Applicable Law: {', '.join(value['sections'])}\n"
                response += f"⚖️ {value['description']}\n"
                response += f"🔒 Bail Status: {value['bail']}\n"
                response += f"📞 Helpline: Police: 100 | Legal Aid: 15100"
                break

    # Default response
    if not response:
        response = ("Main aapki legal queries mein help kar sakta hun!\n\n"
                    "Aap pooch sakte ho:\n"
                    "• FIR kaise file karein?\n"
                    "• Theft/Robbery/Murder ke liye kaunsa IPC section?\n"
                    "• Bail kaise milti hai?\n"
                    "• Legal aid kahan milegi?\n"
                    "• Emergency helplines kya hain?\n"
                    "• Evidence kaise preserve karein?")

    return jsonify({
        "message": message,
        "response": response,
        "helpline": "Police: 100 | Legal Aid: 15100"
    })