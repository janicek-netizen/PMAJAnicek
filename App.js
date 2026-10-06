import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';

export default function App() {
  const [currentTab, setCurrentTab] = useState('profile');

  // Hráčske dáta
  const [money, setMoney] = useState(400);
  const [reputation, setReputation] = useState(20);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [failedTasksCount, setFailedTasksCount] = useState(0);
  const [strikes, setStrikes] = useState(0); // Počet chýb/odmietnutí pred vyhodením
  const [certifications, setCertifications] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  
  // Zamestnanie a pohovory
  const [currentCompany, setCurrentCompany] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);
  const [interviewQIndex, setInterviewQIndex] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);

  // Tickety a pracovisko
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketStep, setTicketStep] = useState(0);

  // Minihra - Zapájanie káblov (T568B)
  const correctCableOrder = ["Oranžovo-biela", "Oranžová", "Zeleno-biela", "Modrá", "Modro-biela", "Zelená", "Hnedo-biela", "Hnedá"];
  const [userCableOrder, setUserCableOrder] = useState([]);
  const [availableCableColors, setAvailableCableColors] = useState([]);

  // --- ROZŠÍRENÝ ZOZNAM FIRIEM (6 FIRIEM) ---
  const companiesList = [
    { 
      id: 1, 
      name: "PC Servis & Káblovanie s.r.o.", 
      reqCert: "Základy IT & Fyzická Kábeláž", 
      payScale: 1.0, 
      desc: "Lokálny servis. Zapájanie patch panelov, crimpovanie a základný helpdesk.",
      maxStrikes: 3,
      interviewQuestions: [
        { q: "Aký konektor sa crimpuje na UTP kábel pre pripojenie do PC?", options: ["RJ11", "RJ45", "USB-C"], correct: 1 },
        { q: "Aká farba vodiča začína v štandarde T568B ako prvá?", options: ["Oranžovo-biela", "Zeleno-biela", "Modrá"], correct: 0 },
        { q: "Na čo slúži tester UTP káblov?", options: ["Na meranie rýchlosti internetu", "Na kontrolu správneho zapojenia pinov", "Na napájanie switchu"], correct: 1 }
      ]
    },
    { 
      id: 2, 
      name: "OfficeNet Solutions", 
      reqCert: "CCNA & Sieťové prepojenia", 
      payScale: 2.2, 
      desc: "Správa podnikových sietí, switchov a routrov pre stredné firmy.",
      maxStrikes: 3,
      interviewQuestions: [
        { q: "Na ktorej vrstve OSI modelu operuje L2 switch?", options: ["Fyzická (1)", "Dátová/Linková (2)", "Sieťová (3)"], correct: 1 },
        { q: "Aká je sieťová maska pre CIDR zápis /24?", options: ["255.255.255.0", "255.255.0.0", "255.0.0.0"], correct: 0 },
        { q: "Ktorý protokol priraďuje IP adresy automaticky v sieti?", options: ["DNS", "DHCP", "FTP"], correct: 1 },
        { q: "Aký port využýva zabezpečený protokol HTTPS?", options: ["80", "443", "21"], correct: 1 }
      ]
    },
    { 
      id: 3, 
      name: "DataCenter Security Corp", 
      reqCert: "Linux SysAdmin & Pokročilé siete", 
      payScale: 3.8, 
      desc: "Správa serverovní, firewallov a Linuxových serverov.",
      maxStrikes: 2,
      interviewQuestions: [
        { q: "Ktorý príkaz v Linuxe vypíše procesy bežiace v reálnom čase?", options: ["top / htop", "ls -la", "cat /etc/passwd"], correct: 0 },
        { q: "Aký port štandardne využýva protokol SSH?", options: ["80", "443", "22"], correct: 2 },
        { q: "Ktorý súbor v Linuxe obsahuje záznamy o sieťových rozhraniach alebo DNS serveroch?", options: ["/etc/resolv.conf", "/var/log/syslog", "/bin/bash"], correct: 0 },
        { q: "Ako zistíš voľné miesto na diskoch?", options: ["df -h", "free -m", "ps aux"], correct: 0 }
      ]
    },
    { 
      id: 4, 
      name: "CloudScale Enterprise", 
      reqCert: "DevOps & Cloud Architektúra", 
      payScale: 6.0, 
      desc: "Budovanie a správa cloudovej infraštruktúry, Docker kontajnerov a CI/CD pipeline.",
      maxStrikes: 2,
      interviewQuestions: [
        { q: "Ktorý nástroj sa používá na správu kontajnerov?", options: ["Docker", "Apache", "MySQL"], correct: 0 },
        { q: "Čo je to Kubernetes?", options: ["Antivírusový systém", "Nástroj na orchestráciu kontajnerov", "Databázový server"], correct: 1 },
        { q: "Aký formát sa najčastejšie používá pre konfiguračné súbory v DevOps (napr. Kubernetes, CI/CD)?", options: ["YAML / JSON", "DOCX", "EXE"], correct: 0 },
        { q: "Ktorý nástroj slúži na Infrastructure as Code (IaC)?", options: ["Terraform", "Photoshop", "Notepad"], correct: 0 }
      ]
    },
    { 
      id: 5, 
      name: "CyberShield Global Defense", 
      reqCert: "CyberSecurity & Pentesting Expert", 
      payScale: 9.0, 
      desc: "Etický hacking, penetračné testovanie a detekcia sieťových útokov.",
      maxStrikes: 2,
      interviewQuestions: [
        { q: "Čo znamená skratka DDoS?", options: ["Distributed Denial of Service", "Direct Domain Secure", "Data Disk Operating System"], correct: 0 },
        { q: "Ktorý nástroj sa používá na sieťové skenovanie portov a hostov?", options: ["Nmap", "Winamp", "Paint"], correct: 0 },
        { q: "Aký protokol slúži na šifrovanú vzdialenú administráciu?", options: ["Telnet", "SSH", "HTTP"], correct: 1 },
        { q: "Čo je to firewall?", options: ["Zariadenie/softvér na filtráciu sieťovej premávky", "Záložný zdroj", "Optický kábel"], correct: 0 }
      ]
    },
    { 
      id: 6, 
      name: "Apex Quantum Solutions", 
      reqCert: "Master Systems Architect", 
      payScale: 15.0, 
      desc: "Špička na trhu. Návrh komplexných globálnych systémov a superpočítačov.",
      maxStrikes: 1,
      interviewQuestions: [
        { q: "Aký je hlavný cieľ vysokej dostupnosti (High Availability)?", options: ["Minimalizácia výpadkov systému (99.99%)", "Zníženie ceny hardvéru", "Zrýchlenie tlačiarní"], correct: 0 },
        { q: "Čo je to Load Balancer?", options: ["Rozdeľovač sieťovej záťaže na viacero serverov", "Zdroj napájania", "Kabelážny kanál"], correct: 0 },
        { q: "Ktorý architektonický vzor rozdeľuje aplikáciu na nezávislé služby?", options: ["Mikroslužby (Microservices)", "Monolit", "Statická stránka"], correct: 0 },
        { q: "Aká databáza sa používá pre masívne distribuované dáta bez pevnej schémy?", options: ["NoSQL", "Excel", "CSV súbor"], correct: 0 }
      ]
    }
  ];

  // --- ROZŠÍRENÉ CERTIFIKÁTY (6 CERTIFIKÁTOV) ---
  const availableCerts = [
    { 
      id: 'c1', 
      name: "Základy IT & Fyzická Kábeláž", 
      cost: 80, 
      questions: [
        { q: "Aký štandard farieb sa používá v Európe pre UTP káble?", options: ["T568B", "RGB", "CMYK"], correct: 0 },
        { q: "Na čo slúži patch panel v rack skrini?", options: ["Na chladenie", "Na prehľadné ukončenie inštalačných káblov", "Na napájanie"], correct: 1 },
        { q: "Aké je maximálne odporúčané dĺžkové prepojenie pre jeden UTP segment?", options: ["10 metrov", "100 metrov", "1 kilometor"], correct: 1 },
        { q: "Aký nástroj sa používá na narážanie vodičov do LSA svorkovnice?", options: ["Narážací nôž", "Kladivo", "Pílka"], correct: 0 },
        { q: "Aký konektor sa používá na koaxiálny televízny alebo anténny kábel?", options: ["F-konektor / BNC", "RJ45", "USB"], correct: 0 }
      ]
    },
    { 
      id: 'c2', 
      name: "CCNA & Sieťové prepojenia", 
      cost: 300, 
      questions: [
        { q: "Ktorá IP adresa je privátna (RFC 1918)?", options: ["8.8.8.8", "10.0.0.15", "159.148.2.1"], correct: 1 },
        { q: "Aký protokol slúži na detekciu chýb a správu v sieťovej vrstve?", options: ["ICMP", "TCP", "UDP"], correct: 0 },
        { q: "Aká je hlavná výhoda VLAN?", options: ["Logická segmentacija a bezpečnosť siete", "Vyššia rýchlosť diskov", "Lepší obraz na monitore"], correct: 0 },
        { q: "Ktorý príkaz v Cisco IOS ukladá konfiguráciu do NVRAM?", options: ["copy running-config startup-config", "save now", "store config"], correct: 0 },
        { q: "Aký port využýva DNS protokol?", options: ["53", "80", "443"], correct: 0 }
      ]
    },
    { 
      id: 'c3', 
      name: "Linux SysAdmin & Pokročilé siete", 
      cost: 600, 
      questions: [
        { q: "Ktorý príkaz zistí využitie diskového priestoru v Linuxe?", options: ["df -h", "free -m", "ps aux"], correct: 0 },
        { q: "Ako reštartujete službu v modernom Linuxe (systemd)?", options: ["systemctl restart nazov_sluzby", "service restart all", "reboot system"], correct: 0 },
        { q: "Kde sú uložené systémové konfiguračné súbory v systémoch typu Linux/Unix?", options: ["/etc", "/var/log", "/tmp"], correct: 0 },
        { q: "Ktorý príkaz zmení vlastníka súboru?", options: ["chown", "chmod", "pwd"], correct: 0 },
        { q: "Čo robí príkaz 'grep'?", options: ["Vyhľadáva textový reťazec v súboroch", "Maže súbory", "Kopíruje adresáre"], correct: 0 }
      ]
    },
    { 
      id: 'c4', 
      name: "DevOps & Cloud Architektúra", 
      cost: 1100, 
      questions: [
        { q: "Ktorý nástroj je štandardom pre kontajnerizáciu aplikácií?", options: ["Docker", "Microsoft Word", "Notepad++"], correct: 0 },
        { q: "Aký nástroj sa používá na Infrastructure as Code?", options: ["Terraform", "Photoshop", "VLC Player"], correct: 0 },
        { q: "Čo je to CI/CD?", options: ["Continuous Integration / Continuous Delivery", "Central Internet / Cable Data", "Core Internal Code Debugger"], correct: 0 },
        { q: "Ktorý súbor sa používá na definíciu multi-kontajnerovej Docker aplikácie?", options: ["docker-compose.yml", "config.exe", "server.bat"], correct: 0 },
        { q: "Kto spravuje najväčšie cloudové platformy (AWS, Azure, GCP)?", options: ["Amazon, Microsoft, Google", "Lokálne reštaurácie", "Lenovo"], correct: 0 }
      ]
    },
    { 
      id: 'c5', 
      name: "CyberSecurity & Pentesting Expert", 
      cost: 1800, 
      questions: [
        { q: "Čo je to SQL Injection?", options: ["Zraniteľnosť umožňujúca vkladať škodlivý SQL kód do databázy", "Ochorenie počítača", "Spôsob zrýchlenia internetu"], correct: 0 },
        { q: "Ktorý sieťový port používa zabezpečený protokol SSH?", options: ["22", "80", "3306"], correct: 0 },
        { q: "Čo znamená skratka VPN?", options: ["Virtual Private Network", "Very Public Node", "Visual Protocol Number"], correct: 0 },
        { q: "Ako sa nazýva proces testovania bezpečnosti systému so súhlasom majiteľa?", options: ["Penetračné testovanie (Pentesting)", "Hrubá sila", "Formátovanie"], correct: 0 },
        { q: "Ktorý nástroj sa používá na analýzu sieťových paketov (sniffer)?", options: ["Wireshark", "Winamp", "Excel"], correct: 0 }
      ]
    },
    { 
      id: 'c6', 
      name: "Master Systems Architect", 
      cost: 3000, 
      questions: [
        { q: "Čo je hlavným princípom mikroslužbovej architektúry?", options: ["Rozdelenie aplikácie na malé nezávislé služby", "Uloženie všetkého do jedného obrovského súboru", "Využitie iba jedného procesora"], correct: 0 },
        { q: "Ako sa zabezpečuje vysoká dostupnosť (HA) kritických systémov?", options: ["Redundancia a klustrovanie serverov", "Vypnutie na noc", "Pomalé pripojenie"], correct: 0 },
        { q: "Čo je to Load Balancing?", options: ["Rovnomerné rozdeľovanie záťaže na viacero serverov", "Odľahčenie batérie", "Zálohovanie dát"], correct: 0 },
        { q: "Aký typ databázy je vhodný pre obrovské distribuované systémy s vysokou škálovateľnosťou?", options: ["NoSQL distribuovaná databáza", "Lokálny textový súbor", "Disketový image"], correct: 0 },
        { q: "Čo znamená pojem 'Zero Trust' v bezpečnosti?", options: ["Nikomu a ničomu v sieti sa automaticky nedôveruje, všetko sa overuje", "Všetci zamestnanci majú plné práva", "Systém nepoužíva heslá"], correct: 0 }
      ]
    }
  ];

  const [activeExam, setActiveExam] = useState(null);
  const [examQuestionIndex, setExamQuestionIndex] = useState(0);
  const [examScore, setExamScore] = useState(0);

  const startExam = (cert) => {
    if (money < cert.cost) {
      Alert.alert("Nedostatok peňazí", "Na tento certifikát nemáš dostatok úspor!");
      return;
    }
    setMoney(money - cert.cost);
    setActiveExam(cert);
    setExamQuestionIndex(0);
    setExamScore(0);
  };

  const answerExamQuestion = (selectedIndex) => {
    const currentQ = activeExam.questions[examQuestionIndex];
    let newScore = examScore;
    if (selectedIndex === currentQ.correct) {
      newScore += 1;
      setExamScore(newScore);
    }

    if (examQuestionIndex + 1 < activeExam.questions.length) {
      setExamQuestionIndex(examQuestionIndex + 1);
    } else {
      const passed = (newScore / activeExam.questions.length) >= 0.8; // 80% úspešnosť
      if (passed) {
        setCertifications([...certifications, activeExam.name]);
        Alert.alert("Skvelá práca!", `Zložil si skúšku na ${newScore}/${activeExam.questions.length}! Získal si certifikát: ${activeExam.name} 🎓`);
      } else {
        Alert.alert("Neúspech", `Získal si len ${newScore}/${activeExam.questions.length}. Na tento náročný certifikát je potrebných aspoň 80%. Skús to znova.`);
      }
      setActiveExam(null);
    }
  };

  // Spustenie pohovoru vo firme
  const startInterview = (comp) => {
    if (!certifications.includes(comp.reqCert)) {
      Alert.alert("Chýba certifikát", `Firma ${comp.name} vyžaduje certifikát: "${comp.reqCert}". Bez neho ťa na pohovor nepustia.`);
      return;
    }
    setActiveInterview(comp);
    setInterviewQIndex(0);
    setInterviewScore(0);
  };

  const answerInterviewQuestion = (selectedIndex) => {
    const currentQ = activeInterview.interviewQuestions[interviewQIndex];
    let newScore = interviewScore;
    if (selectedIndex === currentQ.correct) {
      newScore += 1;
      setInterviewScore(newScore);
    }

    if (interviewQIndex + 1 < activeInterview.interviewQuestions.length) {
      setInterviewQIndex(interviewQIndex + 1);
    } else {
      const passed = newScore >= Math.ceil(activeInterview.interviewQuestions.length / 2);
      if (passed) {
        setCurrentCompany(activeInterview);
        setStrikes(0); // Reset strikeov pri novom zamestnaní
        if (!workHistory.includes(activeInterview.name)) {
          setWorkHistory([...workHistory, activeInterview.name]);
        }
        setCurrentTab('workspace');
        Alert.alert("Pohovor úspešný!", `Personalista bol nadšený z tvojich vedomostí. Firma ${activeInterview.name} ťa oficiálne prijala!`);
      } else {
        Alert.alert("Pohovor neúspešný", "Nezvládol si technické otázky na pohovore. Doplň si vedomosti v Kurzoch a skús to znova.");
      }
      setActiveInterview(null);
    }
  };

  // Generovanie reálneho tiketu s rôznymi úlohami vrátane písania/dopĺňania kódov
  const generateNewTicket = () => {
    if (!currentCompany) return;
    const ticketPool = [
      { 
        type: "cable", 
        title: "Fyzická inštalácia a otestovanie prepojovacieho UTP patch kábla (T568B)", 
        basePay: 70 * currentCompany.payScale 
      },
      { 
        type: "config", 
        title: "Konfigurácia brány, IP adries a sieťových rozhraní na switchi", 
        basePay: 120 * currentCompany.payScale,
        steps: [
          { q: "Aký príkaz použiješ na overenie základnej IP konektivity na cieľový server?", options: ["ping 10.0.0.1", "dir /s", "format c:"], correct: 0 },
          { q: "Aký príkaz slúži na zobrazenie aktívnych sieťových rozhraní a IP adries v Linuxe?", options: ["ip a (alebo ifconfig)", "ls -la", "cat /etc/passwd"], correct: 0 },
          { q: "Ako trvalo uložíš aktuálnu konfiguráciu v Cisco switchi?", options: ["copy running-config startup-config", "save now", "exit"], correct: 0 }
        ]
      },
      { 
        type: "linux", 
        title: "Diagnostika a oprava kritickej chyby linuxového servera & Nginx služby", 
        basePay: 190 * currentCompany.payScale,
        steps: [
          { q: "Kde sa nachádzajú systémové chybové logy (error logy) webservera Nginx?", options: ["/var/log/nginx/error.log", "/etc/hosts", "/bin/sh"], correct: 0 },
          { q: "Aký príkaz zistí aktuálne bežiace procesy a zaťaženie CPU?", options: ["top (alebo htop)", "ls -l", "ping"], correct: 0 },
          { q: "Ako korektne reštartuješ Nginx službu v systéme systemd?", options: ["systemctl restart nginx", "restart web", "shutdown now"], correct: 0 }
        ]
      },
      {
        type: "devops",
        title: "Nasadenie aplikácie a oprava Docker / CI/CD pipeline",
        basePay: 260 * currentCompany.payScale,
        steps: [
          { q: "Ktorý príkaz zostaví (buildne) Docker obraz z Dockerfile?", options: ["docker build -t myapp .", "docker run myapp", "docker stop"], correct: 0 },
          { q: "Ako skontroluješ zoznam všetkých bežiacich kontajnerov?", options: ["docker ps", "docker list", "show containers"], correct: 0 },
          { q: "Ktorý nástroj sa používá na správu a nasadenie v Kubernetes klustri?", options: ["kubectl", "git pull", "npm start"], correct: 0 }
        ]
      }
    ];

    const randomT = ticketPool[Math.floor(Math.random() * ticketPool.length)];
    setActiveTicket({ ...randomT, solved: false });
    setTicketStep(0);
    setUserCableOrder([]);
    setAvailableCableColors([...correctCableOrder].sort(() => Math.random() - 0.5));
  };

  // Pridanie farby v minihre kábla
  const addCableColor = (color) => {
    const nextList = [...userCableOrder, color];
    setUserCableOrder(nextList);
    setAvailableCableColors(availableCableColors.filter(c => c !== color));

    if (nextList.length === correctCableOrder.length) {
      const isCorrect = nextList.every((val, index) => val === correctCableOrder[index]);
      if (isCorrect) {
        setTimeout(() => finishTicket(true), 300);
      } else {
        setTimeout(() => {
          handleTicketFailure("Zlé poradie vodičov v RJ45 konektore podľa normy T568B! Kábel neprešiel certifikáciou.");
        }, 300);
      }
    }
  };

  // Riešenie krokov v konfiguračnom/linuxovom/devops tikete
  const solveTicketStep = (selectedIndex) => {
    const currentStepObj = activeTicket.steps[ticketStep];
    if (selectedIndex === currentStepObj.correct) {
      if (ticketStep + 1 < activeTicket.steps.length) {
        setTicketStep(ticketStep + 1);
      } else {
        finishTicket(true);
      }
    } else {
      handleTicketFailure("Zvolil si nesprávny technický príkaz! Zákazník hlási pretrvávajúci výpadok.");
    }
  };

  const handleTicketFailure = (reason) => {
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);
    setFailedTasksCount(failedTasksCount + 1);
    setReputation(Math.max(0, reputation - 5));
    setActiveTicket(null);

    if (currentCompany && newStrikes >= currentCompany.maxStrikes) {
      Alert.Arabic || Alert.alert("VÝPOVED Z PRÁCE!", `Firma ${currentCompany.name} s tebou ukončila pracovný pomer pre príliš veľa chýb a zlyhaných úloh!`);
      setCurrentCompany(null);
      setStrikes(0);
    } else {
      Alert.alert("Chyba v úlohe!", `${reason}\n⚠️ Varovanie: Strike ${newStrikes}/${currentCompany ? currentCompany.maxStrikes : 3}. Pri dosiahnutí limitu dostaneš výpoveď!`);
    }
  };

  const finishTicket = (success) => {
    if (!success) return;
    const reward = Math.round(activeTicket.basePay);
    setMoney(money + reward);
    setReputation(reputation + 15);
    setCompletedTasksCount(completedTasksCount + 1);
    setActiveTicket(null);
    Alert.alert("Skvelá práca!", `Tiket úspešne vyriešený vlastnoručne! Odmena: $${reward}`);
  };

  // Dobrovoľné stornovanie tiketu (ráta sa ako menší strike)
  const cancelTicket = () => {
    Alert.alert("Tiket stornovaný", "Odmietol si vyriešiť pridelenú úlohu.");
    handleTicketFailure("Odmietnutie prideleného tiketu.");
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Horná lišta - Navigácia */}
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navBtn, currentTab === 'profile' && styles.activeNav]} onPress={() => setCurrentTab('profile')}>
          <Text style={styles.navText}>👤 Vizitka</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, currentTab === 'jobs' && styles.activeNav]} onPress={() => setCurrentTab('jobs')}>
          <Text style={styles.navText}>🏢 Firmy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, currentTab === 'workspace' && styles.activeNav]} onPress={() => setCurrentTab('workspace')}>
          <Text style={styles.navText}>💻 Práca</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, currentTab === 'certifications' && styles.activeNav]} onPress={() => setCurrentTab('certifications')}>
          <Text style={styles.navText}>📜 Kurzy</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* TAB 1: VIZITKA & PROFIL */}
        {currentTab === 'profile' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⭐ Profesný IT & DevOps Profil</Text>
              <Text style={styles.infoText}>💵 Finančné úspory: <Text style={styles.highlight}>${money}</Text></Text>
              <Text style={styles.infoText}>🏆 Reputácia / XP: <Text style={styles.highlight}>{reputation}</Text></Text>
              <Text style={styles.infoText}>✅ Úspešné tickety: <Text style={styles.highlight}>{completedTasksCount}</Text></Text>
              <Text style={styles.infoText}>❌ Zlyhané / Chyby: <Text style={{color: '#f87171', fontWeight: 'bold'}}>{failedTasksCount}</Text></Text>
              <Text style={styles.infoText}>📍 Aktuálne zamestnanie: <Text style={styles.highlight}>{currentCompany ? `${currentCompany.name} (Strikes: ${strikes}/${currentCompany.maxStrikes})` : "Nezamestnaný"}</Text></Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📜 Získané certifikáty ({certifications.length})</Text>
              {certifications.length === 0 ? (
                <Text style={styles.subText}>Zatiaľ nevlastníš žiadne certifikáty. Získaj ich v záložke "Kurzy".</Text>
              ) : (
                certifications.map((cert, idx) => (
                  <Text key={idx} style={styles.listItem}>✔️ {cert}</Text>
                ))
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏢 Pracovná história</Text>
              {workHistory.length === 0 ? (
                <Text style={styles.subText}>Zatiaľ nemáš žiadne záznamy v histórii firiem.</Text>
              ) : (
                workHistory.map((comp, idx) => (
                  <Text key={idx} style={styles.listItem}>🏢 {comp}</Text>
                ))
              )}
            </View>
          </View>
        )}

        {/* TAB 2: FIRMY & POHOVORY */}
        {currentTab === 'jobs' && (
          <View>
            <Text style={styles.headerTitle}>🗺️ Trh práce & Výberové konania</Text>
            <Text style={styles.subText}>Vyber si z ponuky 6 firiem. Splň certifikát, prejď technickým pohovorom a získaj prácu!</Text>

            {activeInterview !== null ? (
              <View style={[styles.card, {borderColor: '#38bdf8', borderWidth: 2}]}>
                <Text style={styles.cardTitle}>👔 Technický pohovor: {activeInterview.name}</Text>
                <Text style={styles.subText}>Otázka {interviewQIndex + 1} z {activeInterview.interviewQuestions.length}</Text>
                <Text style={styles.questionText}>{activeInterview.interviewQuestions[interviewQIndex].q}</Text>

                {activeInterview.interviewQuestions[interviewQIndex].options.map((opt, idx) => (
                  <TouchableOpacity key={idx} style={styles.optBtn} onPress={() => answerInterviewQuestion(idx)}>
                    <Text style={styles.optText}>{opt}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={[styles.subBtn, {backgroundColor: '#dc2626', marginTop: 10}]} onPress={() => setActiveInterview(null)}>
                  <Text style={styles.subBtnText}>Zrušiť pohovor</Text>
                </TouchableOpacity>
              </View>
            ) : (
              companiesList.map((comp) => {
                const hasCert = certifications.includes(comp.reqCert);
                const isCurrent = currentCompany && currentCompany.id === comp.id;
                return (
                  <View key={comp.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{comp.name}</Text>
                    <Text style={styles.subText}>{comp.desc}</Text>
                    <Text style={styles.infoText}>💰 Násobič platu: <Text style={styles.highlight}>{comp.payScale}x</Text></Text>
                    <Text style={styles.reqText}>
                      Požadovaný certifikát: <Text style={{color: hasCert ? '#34d399' : '#f87171', fontWeight: 'bold'}}>{comp.reqCert}</Text>
                    </Text>

                    <TouchableOpacity 
                      style={[styles.actionBtn, isCurrent && {backgroundColor: '#059669'}, !hasCert && {backgroundColor: '#374151'}]} 
                      onPress={() => !isCurrent && startInterview(comp)}
                    >
                      <Text style={styles.actionBtnText}>
                        {isCurrent ? "✔️ Tu momentálne pracuješ" : (hasCert ? "Absolvować technický pohovor" : "🔒 Chýba certifikát")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* TAB 3: PRACOVISKO */}
        {currentTab === 'workspace' && (
          <View>
            <Text style={styles.headerTitle}>💻 Pracovný terminál</Text>
            {!currentCompany ? (
              <View style={styles.card}>
                <Text style={styles.subText}>Nie si zamestnaný v žiadnej firme! Prejdi do záložky "Firmy", sprav si pohovor a získaj zamestnanie.</Text>
              </View>
            ) : (
              <View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Zamestnávateľ: {currentCompany.name}</Text>
                  <Text style={styles.subText}>Varovania (Strikes): <Text style={{color: '#f87171', fontWeight: 'bold'}}>{strikes} / {currentCompany.maxStrikes}</Text></Text>
                  
                  {!activeTicket ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={generateNewTicket}>
                      <Text style={styles.actionBtnText}>🔍 Prijať nový tiket / úlohu</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.ticketBox}>
                      <Text style={styles.ticketTitle}>🚨 Aktívny tiket:</Text>
                      <Text style={styles.ticketDesc}>{activeTicket.title}</Text>

                      {/* MINIHERA 1: KÁBEL */}
                      {activeTicket.type === 'cable' && (
                        <View style={{marginTop: 10}}>
                          <Text style={styles.miniGameInstruction}>Praktická úloha: Zostav poradie 8 vodičov pre štandard T568B:</Text>
                          <Text style={styles.cableBuildText}>Zapojenie ({userCableOrder.length}/8):</Text>
                          <Text style={{color: '#34d399', fontSize: 12, marginBottom: 8}}>{userCableOrder.join(' ➔ ') || "(prázdne)"}</Text>

                          <View style={styles.colorButtonsRow}>
                            {availableCableColors.map((col, idx) => (
                              <TouchableOpacity key={idx} style={styles.colorBtn} onPress={() => addCableColor(col)}>
                                <Text style={styles.colorBtnText}>+ {col}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <TouchableOpacity style={[styles.subBtn, {backgroundColor: '#dc2626', marginTop: 15}]} onPress={cancelTicket}>
                            <Text style={styles.subBtnText}>Odmietnuť / Stornovať tiket</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* MINIHERA 2, 3, 4: KONFIGURÁCIA / LINUX / DEVOPS */}
                      {(activeTicket.type === 'config' || activeTicket.type === 'linux' || activeTicket.type === 'devops') && (
                        <View style={{marginTop: 10}}>
                          <Text style={styles.miniGameInstruction}>Krok {ticketStep + 1} z {activeTicket.steps.length}:</Text>
                          <Text style={styles.questionText}>{activeTicket.steps[ticketStep].q}</Text>

                          {activeTicket.steps[ticketStep].options.map((opt, idx) => (
                            <TouchableOpacity key={idx} style={styles.optBtn} onPress={() => solveTicketStep(idx)}>
                              <Text style={styles.optText}>{opt}</Text>
                            </TouchableOpacity>
                          ))}

                          <TouchableOpacity style={[styles.subBtn, {backgroundColor: '#dc2626', marginTop: 10}]} onPress={cancelTicket}>
                            <Text style={styles.subBtnText}>Stornovať tiket</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB 4: KURZY A CERTIFIKÁTY */}
        {currentTab === 'certifications' && (
          <View>
            <Text style={styles.headerTitle}>📜 Certifikačná akadémia (6 úrovní)</Text>
            
            {activeExam !== null ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📝 Skúška: {activeExam.name}</Text>
                <Text style={styles.subText}>Otázka {examQuestionIndex + 1} z {activeExam.questions.length}</Text>
                <Text style={styles.questionText}>{activeExam.questions[examQuestionIndex].q}</Text>

                {activeExam.questions[examQuestionIndex].options.map((opt, idx) => (
                  <TouchableOpacity key={idx} style={styles.optBtn} onPress={() => answerExamQuestion(idx)}>
                    <Text style={styles.optText}>{opt}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={[styles.subBtn, {backgroundColor: '#dc2626', marginTop: 10}]} onPress={() => setActiveExam(null)}>
                  <Text style={styles.subBtnText}>Prerušiť skúšku</Text>
                </TouchableOpacity>
              </View>
            ) : (
              availableCerts.map((cert) => {
                const owned = certifications.includes(cert.name);
                return (
                  <View key={cert.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{cert.name}</Text>
                    <Text style={styles.subText}>Cena za pokus: ${cert.cost} | Otázok: {cert.questions.length}</Text>
                    
                    <TouchableOpacity 
                      style={[styles.actionBtn, owned && {backgroundColor: '#059669'}]} 
                      onPress={() => !owned && startExam(cert)}
                    >
                      <Text style={styles.actionBtnText}>{owned ? "✔️ Certifikát už vlastníš" : "Spustiť certifikačný test"}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#090d16',
    paddingTop: 35 
  },
  navBar: { 
    flexDirection: 'row', 
    backgroundColor: '#111827', 
    borderBottomWidth: 1, 
    borderBottomColor: '#1f2937',
    paddingVertical: 6
  },
  navBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center' 
  },
  activeNav: { 
    borderBottomWidth: 3, 
    borderBottomColor: '#38bdf8', 
    backgroundColor: '#1f2937' 
  },
  navText: { 
    color: '#f9fafb', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  scroll: { 
    padding: 15 
  },
  headerTitle: { 
    color: '#38bdf8', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  subText: { 
    color: '#9ca3af', 
    fontSize: 12, 
    marginBottom: 10,
    lineHeight: 16
  },
  card: { 
    backgroundColor: '#111827', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#1f2937' 
  },
  cardTitle: { 
    color: '#38bdf8', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  infoText: { 
    color: '#d1d5db', 
    fontSize: 14, 
    marginVertical: 3 
  },
  highlight: { 
    color: '#34d399', 
    fontWeight: 'bold' 
  },
  listItem: { 
    color: '#e5e7eb', 
    fontSize: 13, 
    marginVertical: 2 
  },
  reqText: { 
    color: '#9ca3af', 
    fontSize: 12, 
    marginVertical: 8 
  },
  actionBtn: { 
    backgroundColor: '#2563eb', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 8 
  },
  actionBtnText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  ticketBox: { 
    backgroundColor: '#1f2937', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 10 
  },
  ticketTitle: { 
    color: '#f87171', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  ticketDesc: { 
    color: '#fff', 
    fontSize: 13, 
    marginVertical: 5,
    lineHeight: 18
  },
  miniGameInstruction: {
    color: '#fbbf24',
    fontSize: 12,
    marginVertical: 6,
    lineHeight: 16
  },
  cableBuildText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: 4
  },
  colorButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  colorBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    margin: 3
  },
  colorBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  subBtn: { 
    padding: 10, 
    borderRadius: 6, 
    alignItems: 'center' 
  },
  subBtnText: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  questionText: { 
    color: '#fff', 
    fontSize: 15, 
    marginVertical: 10,
    lineHeight: 20
  },
  optBtn: { 
    backgroundColor: '#334155', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 5 
  },
  optText: { 
    color: '#fff', 
    fontSize: 13,
    lineHeight: 18
  }
});