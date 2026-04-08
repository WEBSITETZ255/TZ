export function initChatbot() {
    const container = document.getElementById("chatbot-container");
    if (!container) return;
    container.innerHTML = `
        <div id="chatbot-bubble" class="chatbot-bubble">
            <i class="fas fa-robot"></i>
        </div>
        <div id="chatbot-window" class="chatbot-window hidden">
            <div class="chatbot-header">
                <span>MATO MEDIA AI</span>
                <button id="chatbot-close">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="bot-msg">Habari! Mimi ni AI wa MATO MEDIA TZ. Uliza lolote kuhusu huduma zetu (blue tick, followers, website, n.k.)</div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Andika swali lako...">
                <button id="chatbot-send"><i class="fas fa-paper-plane"></i></button>
            </div>
            <div class="chatbot-wa-hint">
                <a href="https://wa.me/255719558569" target="_blank">Ongea na Mtu Halisi WhatsApp</a>
            </div>
        </div>
    `;
    const bubble = document.getElementById("chatbot-bubble");
    const windowDiv = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chatbot-close");
    const sendBtn = document.getElementById("chatbot-send");
    const input = document.getElementById("chatbot-input");
    const messagesDiv = document.getElementById("chatbot-messages");
    function toggleWindow() { windowDiv.classList.toggle("hidden"); }
    bubble.onclick = toggleWindow;
    if (closeBtn) closeBtn.onclick = toggleWindow;
    const faq = [
        { keywords: ["muziki","sambaza","boomplay","spotify","audiomack"], answer: "Tunasambaza muziki wako kwenye Boomplay, Spotify, Audiomack, Apple Music na majukwaa yote." },
        { keywords: ["followers","likes","views","streams","kukuza"], answer: "Tunaongeza followers, likes, views na streams kwa Instagram, TikTok, YouTube, Facebook na Audiomack. Omba huduma kwenye Dashboard." },
        { keywords: ["akaunti imefungiwa","kuibiwa","recover","rudisha"], answer: "Ndiyo, tunasaidia kurejesha akaunti zilizofungiwa au kuibiwa. Wasiliana nasi kwa WhatsApp +255719558569." },
        { keywords: ["blue tick","verified","verification"], answer: "Tunatoa Blue Tick kwa Instagram, TikTok, YouTube na Facebook. Tuma ombi kupitia Dashboard au WhatsApp yetu." },
        { keywords: ["tengeneza website","blog","tovuti"], answer: "Tunatengeneza website na blog za kitaalamu kwa biashara yako. Pata quote kwenye Dashboard." },
        { keywords: ["elimu","kipato","fundisha","training"], answer: "Tunatoa mafunzo ya kupata kipato mitandaoni, ukuaji wa akaunti, na uuzaji mtandaoni. Jiunge nasi kwa WhatsApp." },
        { keywords: ["bei","gharama","cost","price"], answer: "Bei hutofautiana kulingana na huduma. Tafadhali wasiliana nasi WhatsApp +255719558569 kwa quote maalum." }
    ];
    function getBotAnswer(question) {
        const lowerQ = question.toLowerCase();
        for (let item of faq) {
            for (let kw of item.keywords) {
                if (lowerQ.includes(kw)) return item.answer;
            }
        }
        return "Samahani, sijaelewa vizuri. Tafadhali wasiliana nasi moja kwa moja kwa WhatsApp +255719558569 au uulize kwa maneno rahisi kama 'blue tick', 'followers', 'website'.";
    }
    function addMessage(text, isUser) {
        const msgDiv = document.createElement("div");
        msgDiv.className = isUser ? "user-msg" : "bot-msg";
        msgDiv.innerText = text;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    function handleSend() {
        const question = input.value.trim();
        if (!question) return;
        addMessage(question, true);
        input.value = "";
        const answer = getBotAnswer(question);
        setTimeout(() => addMessage(answer, false), 400);
    }
    sendBtn.onclick = handleSend;
    input.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSend(); });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initChatbot());
else initChatbot();
// style za chatbot
const style = document.createElement('style');
style.textContent = `
    .chatbot-bubble {
        position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
        background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 50%;
        display: flex; align-items: center; justify-content: center; cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1001;
    }
    .chatbot-bubble i { font-size: 28px; color: white; }
    .chatbot-window {
        position: fixed; bottom: 90px; right: 20px; width: 320px; background: white;
        border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex; flex-direction: column; z-index: 1001; font-family: 'Inter', sans-serif;
        border: 1px solid #e2e8f0;
    }
    .hidden { display: none; }
    .chatbot-header {
        background: #f97316; padding: 12px 16px; border-radius: 24px 24px 0 0;
        color: white; display: flex; justify-content: space-between; font-weight: bold;
    }
    .chatbot-header button { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
    .chatbot-messages { height: 300px; overflow-y: auto; padding: 12px; background: #f9fafb; display: flex; flex-direction: column; gap: 8px; }
    .bot-msg, .user-msg { max-width: 85%; padding: 8px 12px; border-radius: 18px; font-size: 14px; }
    .bot-msg { background: #e5e7eb; align-self: flex-start; }
    .user-msg { background: #f97316; color: white; align-self: flex-end; }
    .chatbot-input-area { display: flex; border-top: 1px solid #e2e8f0; padding: 8px; }
    .chatbot-input-area input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 40px; outline: none; }
    .chatbot-input-area button { background: #f97316; border: none; border-radius: 40px; margin-left: 8px; padding: 0 14px; color: white; cursor: pointer; }
    .chatbot-wa-hint { text-align: center; padding: 8px; font-size: 12px; background: #f1f5f9; border-radius: 0 0 24px 24px; }
    .chatbot-wa-hint a { color: #f97316; text-decoration: none; }
`;
document.head.appendChild(style);