document.addEventListener('DOMContentLoaded', () => {
    // Initial State
    let subjects = [
        { id: Date.now(), name: 'Mathematics', max: 100, obtained: 92 },
        { id: Date.now() + 1, name: 'Science', max: 100, obtained: 88 },
        { id: Date.now() + 2, name: 'History', max: 100, obtained: 95 }
    ];

    // Selectors
    const instNameInput = document.getElementById('instName');
    const studentNameInput = document.getElementById('studentName');
    const fatherNameInput = document.getElementById('fatherName');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const sig1Input = document.getElementById('sig1');
    const sig2Input = document.getElementById('sig2');
    const subjectsList = document.getElementById('subjectsList');
    const addSubjectBtn = document.getElementById('addSubject');
    const downloadPdfBtn = document.getElementById('downloadPdf');

    // Display Selectors
    const certInstNameDisplay = document.getElementById('certInstNameDisplay');
    const certStudentNameDisplay = document.getElementById('certStudentNameDisplay');
    const certFatherNameDisplay = document.getElementById('certFatherNameDisplay');
    const certMarksDisplay = document.getElementById('certMarksDisplay');
    const certTotalMarks = document.getElementById('certTotalMarks');
    const certFinalGrade = document.getElementById('certFinalGrade');
    const certStartDateDisplay = document.getElementById('certStartDateDisplay');
    const certEndDateDisplay = document.getElementById('certEndDateDisplay');
    const certSig1Display = document.getElementById('certSig1Display');
    const certSig2Display = document.getElementById('certSig2Display');

    // Update Display Functions
    const updateBasics = () => {
        certInstNameDisplay.textContent = instNameInput.value || 'INSTITUTION NAME';
        certStudentNameDisplay.textContent = studentNameInput.value || 'STUDENT NAME';
        certFatherNameDisplay.textContent = fatherNameInput.value || 'FATHER\'S NAME';
        certStartDateDisplay.textContent = startDateInput.value || 'START DATE';
        certEndDateDisplay.textContent = endDateInput.value || 'END DATE';
        certSig1Display.textContent = sig1Input.value || 'SIGNATURE 1';
        certSig2Display.textContent = sig2Input.value || 'SIGNATURE 2';
    };

    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    const updateMarksDisplay = () => {
        certMarksDisplay.innerHTML = '';
        let totalObtained = 0;
        let totalMax = 0;

        subjects.forEach(subject => {
            const percentage = (subject.obtained / subject.max) * 100;
            const grade = calculateGrade(percentage);

            totalObtained += Number(subject.obtained);
            totalMax += Number(subject.max);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td>${subject.max}</td>
                <td>${subject.obtained}</td>
                <td>${grade}</td>
            `;
            certMarksDisplay.appendChild(row);
        });

        certTotalMarks.textContent = `${totalObtained} / ${totalMax}`;
        const overallPercentage = (totalObtained / totalMax) * 100;
        certFinalGrade.textContent = calculateGrade(overallPercentage);
    };

    const renderEditorSubjects = () => {
        subjectsList.innerHTML = '';
        subjects.forEach((subject, index) => {
            const div = document.createElement('div');
            div.className = 'subject-item';
            div.innerHTML = `
                <input type="text" value="${subject.name}" placeholder="Subject" onchange="window.updateSubjectField(${index}, 'name', this.value)">
                <input type="number" value="${subject.max}" placeholder="Max" onchange="window.updateSubjectField(${index}, 'max', this.value)">
                <input type="number" value="${subject.obtained}" placeholder="Marks" onchange="window.updateSubjectField(${index}, 'obtained', this.value)">
                <button class="btn-icon-del" onclick="window.removeSubject(${index})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            `;
            subjectsList.appendChild(div);
        });
        updateMarksDisplay();
    };

    // Window global handlers for inline events
    window.updateSubjectField = (index, field, value) => {
        subjects[index][field] = field === 'name' ? value : Number(value);
        updateMarksDisplay();
    };

    window.removeSubject = (index) => {
        subjects.splice(index, 1);
        renderEditorSubjects();
    };

    // Event Listeners
    instNameInput.addEventListener('input', updateBasics);
    studentNameInput.addEventListener('input', updateBasics);
    fatherNameInput.addEventListener('input', updateBasics);
    startDateInput.addEventListener('input', updateBasics);
    endDateInput.addEventListener('input', updateBasics);
    sig1Input.addEventListener('input', updateBasics);
    sig2Input.addEventListener('input', updateBasics);

    addSubjectBtn.addEventListener('click', () => {
        subjects.push({ id: Date.now(), name: 'New Subject', max: 100, obtained: 0 });
        renderEditorSubjects();
    });

    downloadPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('certificate');
        const opt = {
            margin: 0,
            filename: `${studentNameInput.value || 'certificate'}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });

    // Dynamic Scaling for Preview Area
    const scalePreview = () => {
        const wrapper = document.querySelector('.preview-area');
        const cert = document.getElementById('certificate');
        const wrapperDiv = document.getElementById('certificateWrapper');
        if (!wrapper || !cert || !wrapperDiv) return;

        const padding = 40;
        const availableWidth = wrapper.clientWidth - padding;
        const availableHeight = wrapper.clientHeight - padding;

        const isMobile = window.innerWidth <= 768;

        let scale;
        if (isMobile) {
            // On mobile, scale to fit width and allow vertical scrolling
            scale = availableWidth / cert.offsetWidth;
            // Adjust wrapper height to match scaled certificate height so we don't have huge gaps
            wrapperDiv.style.height = (cert.offsetHeight * scale) + "px";
            wrapperDiv.style.width = (cert.offsetWidth * scale) + "px";
        } else {
            // Desktop: fit both dimensions
            const scaleW = availableWidth / cert.offsetWidth;
            const scaleH = availableHeight / cert.offsetHeight;
            scale = Math.min(scaleW, scaleH);
            wrapperDiv.style.height = "auto";
            wrapperDiv.style.width = "auto";
        }

        wrapperDiv.style.transform = `scale(${scale})`;
    };

    window.addEventListener('resize', scalePreview);
    updateBasics();
    renderEditorSubjects();
    scalePreview();
});
