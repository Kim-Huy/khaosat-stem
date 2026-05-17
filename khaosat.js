const questions = [

{
question:"1. Bạn từng dùng công nghệ nào?",
options:["Arduino","ESP32","Robot","Web"]
},

{
question:"2. Bạn từng dùng cảm biến nào?",
options:["IR","Ultrasonic","Camera AI","VL53L0X"]
},

{
question:"3. Bạn từng làm project gì?",
options:["Robot","IoT","AI","Web"]
},

{
question:"4. Bạn từng dùng motor nào?",
options:["Servo","DC","Stepper","BLDC"]
},

{
question:"5. Bạn thường debug bằng gì?",
options:["Google","YouTube","ChatGPT","Tự tìm"]
},

{
question:"6. Bạn từng dùng giao tiếp nào?",
options:["UART","I2C","SPI","PWM"]
},

{
question:"7. Bạn thích mảng nào?",
options:["AI","Robot","Automation","IoT"]
},

{
question:"8. Bạn từng làm website chưa?",
options:["HTML","CSS","JS","NodeJS"]
},

{
question:"9. Bạn từng dùng AI chưa?",
options:["ChatGPT","YOLO","OpenCV","Chưa"]
},

{
question:"10. Bạn từng fail project chưa?",
options:["Code","Mạch","Deadline","Chưa"]
},

{
question:"11. Bạn từng hàn mạch chưa?",
options:["Có","Chưa","Nhiều lần","Muốn thử"]
},

{
question:"12. Bạn từng đọc datasheet chưa?",
options:["Có","Chưa","Thường xuyên","Để debug"]
},

{
question:"13. Bạn từng tham gia cuộc thi nào?",
options:["KHKT","STEM","Hackathon","Robocon"]
},

{
question:"14. Bạn học công nghệ bằng gì?",
options:["Google","YouTube","Tài liệu","Tự nghiên cứu"]
},

{
question:"15. Bạn thích hardware hay software?",
options:["Hardware","Software","Cả hai","Không rõ"]
},

{
question:"16. Bạn từng làm robot chưa?",
options:["Có","Chưa","Đang làm","Nhiều lần"]
},

{
question:"17. Điều khó nhất khi làm project?",
options:["Code","Mạch","Thời gian","Tiền"]
},

{
question:"18. Bạn từng dùng phần mềm nào?",
options:["VS Code","Proteus","Fusion 360","Arduino IDE"]
},

{
question:"19. Bạn muốn học thêm gì?",
options:["AI","Robot","Web","IoT"]
},

{
question:"20. Điều khiến bạn thích STEM?",
options:["Sáng tạo","AI","Robot","Project thực tế"]
}

];

const container =
document.getElementById('questions');

/* =========================
   RENDER QUESTIONS
========================= */

questions.forEach((q,index)=>{

    let html = `

    <div class="question">

    <h3>${q.question}</h3>
    `;

    /* OPTIONS */

    q.options.forEach(option=>{

        html += `

        <label>

        <input
        type="checkbox"
        name="q${index+1}"
        value="${option}"
        >

        ${option}

        </label>
        `;
    });

    /* OTHER OPTION */

    html += `

    <label>

    <input
    type="checkbox"
    id="otherCheck${index+1}"
    onclick="toggleOther(${index+1})"
    >

    Khác

    </label>

    <input
    type="text"

    id="otherInput${index+1}"

    placeholder="Nhập câu trả lời khác..."

    style="
    display:none;
    margin-top:10px;
    "
    >
    `;

    html += `</div>`;

    container.innerHTML += html;
});

/* =========================
   SHOW / HIDE OTHER INPUT
========================= */

function toggleOther(id){

    const checkbox =
    document.getElementById(
        `otherCheck${id}`
    );

    const input =
    document.getElementById(
        `otherInput${id}`
    );

    if(checkbox.checked){

        input.style.display = 'block';

    }else{

        input.style.display = 'none';

        input.value = '';
    }
}

/* =========================
   POPUP
========================= */

function showPopup(message,type){

    const popup =
    document.getElementById('popup');

    popup.innerText = message;

    popup.className =
    `popup show ${type}`;

    setTimeout(()=>{

        popup.classList.remove('show');

    },3000);
}

/* =========================
   GET ANSWERS
========================= */

function getCheckboxValues(name,id){

    const checked = [];

    document
    .querySelectorAll(
        `input[name="${name}"]:checked`
    )
    .forEach((checkbox)=>{

        checked.push(
            checkbox.value
        );

    });

    /* OTHER */

    const otherCheck =
    document.getElementById(
        `otherCheck${id}`
    );

    const otherInput =
    document.getElementById(
        `otherInput${id}`
    );

    if(
        otherCheck &&
        otherCheck.checked &&
        otherInput.value.trim() !== ''
    ){

        checked.push(
            `Khác: ${otherInput.value}`
        );
    }

    return checked;
}

/* =========================
   SUBMIT
========================= */

async function submitSurvey(){

    const name =
    document.getElementById('name')
    .value
    .trim();

    const className =
    document.getElementById('className')
    .value
    .trim();

    /* CHECK */

    if(!name || !className){

        showPopup(
            'Vui lòng nhập đầy đủ họ tên và lớp',
            'error'
        );

        return;
    }

    const answers = {};

    /* TRẮC NGHIỆM */

    for(let i=1;i<=20;i++){

        answers[`q${i}`] =
        getCheckboxValues(
            `q${i}`,
            i
        );
    }

    /* TỰ LUẬN */

    for(let i=21;i<=35;i++){

        const textarea =
        document.getElementById(
            `q${i}`
        );

        if(textarea){

            answers[`q${i}`] =
            textarea.value;
        }
    }

    try{

        await addDoc(
        collection(
            db,
            "submissions"
        ),
        {

            name,
            className,
            answers,

            submittedAt:
            new Date()
            .toLocaleString()

        });

        showPopup(
            'Nộp khảo sát thành công',
            'success'
        );

        /* RESET */

        document
        .getElementById('name')
        .value='';

        document
        .getElementById('className')
        .value='';

        document
        .querySelectorAll('textarea')
        .forEach(t=>t.value='');

        document
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach(c=>c.checked=false);

        document
        .querySelectorAll(
            'input[type="text"]'
        )
        .forEach(input=>{

            if(
            input.id.includes(
                'otherInput'
            )
            ){

                input.value='';

                input.style.display='none';
            }
        });

    }catch(error){

        console.log(error);

        showPopup(
            'Có lỗi xảy ra',
            'error'
        );
    }
}
