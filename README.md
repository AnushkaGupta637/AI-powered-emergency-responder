# 🛟 AI-Powered Emergency Responder App

An AI-driven mobile application that provides **life-saving support** during emergencies—designed especially for rural and remote areas where **language barriers**, **limited medical knowledge**, and **poor internet connectivity** can delay critical care.

---

## 🚀 Features

- **Quick Access from Lock Screen**  
  Access emergency help without unlocking your phone.

- **Multi-modal Input**  
  Describe emergencies using **voice**, **text**, or **images**.

- **Local Language Support**  
  Speak in your **native language**—our translation models handle the rest.

- **On-device AI (SLM)**  
  Receive **offline** first-aid guidance with **Small Language Models (SLMs)**.

- **Cloud-based AI (LLM)**  
  Get more advanced, context-aware help using **Large Language Models** when online.

- **Voice-based Assistance**  
  Instructions are read out loud using **text-to-speech**, helping users who can't read.

- **Emergency Contacts & Medical Info**  
  Store key contacts and **critical medical history** during setup for faster responses.

- **Extreme Emergency Mode**  
  One tap sends your **live location and medical details** to your emergency contacts and local hospitals.

---

## 📂 Project Structure

project/
├── app/
│ ├── (tabs)/
│ │ ├── index.tsx # Main screen with Quick Actions
│ │ └── emergency.tsx # Emergency help screen
│ └── ...
├── assets/ # App icons, images, etc.
├── components/ # Reusable UI components
├── llm_paramedic_model/ # On-device language model
├── App.tsx # Entry point with navigation stack
└── README.md

## 🧠 Tech Stack

- **React Native / Expo** – Mobile app framework  
- **Transformers + HuggingFace** – For SLM/LLM integration  
- **React Navigation** – Navigation between screens  
- **Text-to-Speech API** – For audible instructions  
- **Multi-language Translation Models** – For regional language support  
- **SQLite / AsyncStorage** – Offline storage of emergency info

---

## ⚙️Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnushkaGupta637/AI-powered-emergency-responder.git
   cd emergency-responder-app

2. Install dependencies

    npm install
    or
    yarn install
    npm run dev
    
    (Optional) Load local LLM
    Place your llm_paramedic_model folder inside the root directory. Make sure it contains a valid config.json with model_type.
    
    🔐 Permissions
    This app requests:
    
    Location Access – to send real-time location during emergencies
    
    Microphone Access – for voice-based interaction
    
    Storage Access – to allow image input for injury detection
    
    🙋‍♀️ Why This App?
    In emergency situations—especially in rural areas—every second counts. Our app ensures:
    
    Help reaches even without internet
    
    No language or literacy barrier
    
    AI-assisted guidance in the most critical moments
  
  📜 License
  This project is open-source and available under the MIT License.
