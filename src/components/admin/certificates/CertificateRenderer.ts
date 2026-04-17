"use client";

interface CertificateData {
    studentName: string;
    courseName: string;
    completionDate: string;
    certificateNumber: string;
}

export function generateCertificateCanvas(
    data: CertificateData,
    logoImg: HTMLImageElement | null
): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext("2d")!;

    // ── Background ──
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 750);

    // ── Decorative blue corner shapes ──
    const drawCornerAccent = (x: number, y: number, flipX: boolean, flipY: boolean) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

        // Large triangle
        const grad1 = ctx.createLinearGradient(0, 0, 180, 180);
        grad1.addColorStop(0, "#1a3a6e");
        grad1.addColorStop(1, "#3b82f6");
        ctx.fillStyle = grad1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 0);
        ctx.lineTo(0, 200);
        ctx.closePath();
        ctx.fill();

        // Smaller accent triangle
        const grad2 = ctx.createLinearGradient(0, 0, 100, 100);
        grad2.addColorStop(0, "#2563eb");
        grad2.addColorStop(1, "#60a5fa");
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(120, 0);
        ctx.lineTo(0, 120);
        ctx.closePath();
        ctx.fill();

        // Thin accent line
        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(220, 0);
        ctx.lineTo(0, 220);
        ctx.stroke();

        // Decorative dots
        ctx.fillStyle = "#93c5fd";
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(160 + i * 18, 30, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    };

    // Top-left corner
    drawCornerAccent(0, 0, false, false);
    // Top-right corner
    drawCornerAccent(1200, 0, true, false);
    // Bottom-left corner
    drawCornerAccent(0, 750, false, true);
    // Bottom-right corner
    drawCornerAccent(1200, 750, true, true);

    // ── Decorative border ──
    ctx.strokeStyle = "#dbeafe";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 690);

    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 670);

    // ── Side accent lines ──
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(15, 200);
    ctx.lineTo(15, 550);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1185, 200);
    ctx.lineTo(1185, 550);
    ctx.stroke();

    // ── Logo ──
    if (logoImg) {
        const logoW = 220;
        const logoH = (logoImg.height / logoImg.width) * logoW;
        ctx.drawImage(logoImg, (1200 - logoW) / 2, 70, logoW, logoH);
    } else {
        // Fallback text logo
        ctx.fillStyle = "#1a3a6e";
        ctx.font = "bold 28px 'Georgia', serif";
        ctx.textAlign = "center";
        ctx.fillText("Paarsh E-Learning", 600, 110);
    }

    // ── "This is to Certify that" ──
    ctx.fillStyle = "#475569";
    ctx.font = "italic 20px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("This is to Certify that", 600, 220);

    // ── Student Name ──
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 44px 'Georgia', serif";
    ctx.fillText(data.studentName, 600, 290);

    // ── Underline under student name ──
    const nameWidth = ctx.measureText(data.studentName).width;
    const grad3 = ctx.createLinearGradient(600 - nameWidth / 2, 300, 600 + nameWidth / 2, 300);
    grad3.addColorStop(0, "transparent");
    grad3.addColorStop(0.2, "#3b82f6");
    grad3.addColorStop(0.8, "#3b82f6");
    grad3.addColorStop(1, "transparent");
    ctx.strokeStyle = grad3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600 - nameWidth / 2 - 20, 305);
    ctx.lineTo(600 + nameWidth / 2 + 20, 305);
    ctx.stroke();

    // ── "Has Successfully completed the Training in" ──
    ctx.fillStyle = "#64748b";
    ctx.font = "18px 'Georgia', serif";
    ctx.fillText("Has Successfully completed the Training in", 600, 360);

    // ── Course Name ──
    ctx.fillStyle = "#1a3a6e";
    ctx.font = "bold 36px 'Georgia', serif";
    ctx.fillText(data.courseName, 600, 420);

    // ── Completion Date ──
    const dateObj = new Date(data.completionDate);
    const day = dateObj.getDate();
    const suffix = (d: number) => {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
    };
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateStr = `On ${day}${suffix(day)} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    ctx.fillStyle = "#64748b";
    ctx.font = "18px 'Georgia', serif";
    ctx.fillText(dateStr, 600, 480);

    // ── Certificate number ──
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Certificate No: ${data.certificateNumber}`, 60, 680);

    // ── Signature area ──
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(880, 560);
    ctx.lineTo(1100, 560);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "14px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("Authorized Signatory", 990, 585);

    // ── Date of issue line ──
    ctx.strokeStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(100, 560);
    ctx.lineTo(320, 560);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "14px 'Georgia', serif";
    ctx.fillText("Date of Issue", 210, 585);

    ctx.fillStyle = "#475569";
    ctx.font = "15px 'Georgia', serif";
    ctx.fillText(dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), 210, 550);

    // ── "INDUSTRY RECOGNIZED" badge ──
    const badgeX = 600;
    const badgeY = 660;
    const badgeW = 280;
    const badgeH = 42;

    // Badge background
    const badgeGrad = ctx.createLinearGradient(badgeX - badgeW / 2, badgeY, badgeX + badgeW / 2, badgeY);
    badgeGrad.addColorStop(0, "#0d9488");
    badgeGrad.addColorStop(1, "#14b8a6");
    ctx.fillStyle = badgeGrad;

    // Rounded rectangle
    const r = 21;
    ctx.beginPath();
    ctx.moveTo(badgeX - badgeW / 2 + r, badgeY - badgeH / 2);
    ctx.lineTo(badgeX + badgeW / 2 - r, badgeY - badgeH / 2);
    ctx.arcTo(badgeX + badgeW / 2, badgeY - badgeH / 2, badgeX + badgeW / 2, badgeY, r);
    ctx.lineTo(badgeX + badgeW / 2, badgeY + badgeH / 2 - r);
    ctx.arcTo(badgeX + badgeW / 2, badgeY + badgeH / 2, badgeX + badgeW / 2 - r, badgeY + badgeH / 2, r);
    ctx.lineTo(badgeX - badgeW / 2 + r, badgeY + badgeH / 2);
    ctx.arcTo(badgeX - badgeW / 2, badgeY + badgeH / 2, badgeX - badgeW / 2, badgeY + badgeH / 2 - r, r);
    ctx.lineTo(badgeX - badgeW / 2, badgeY - badgeH / 2 + r);
    ctx.arcTo(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeX - badgeW / 2 + r, badgeY - badgeH / 2, r);
    ctx.closePath();
    ctx.fill();

    // Badge checkmark
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓  INDUSTRY RECOGNIZED", badgeX, badgeY + 6);

    // ── Decorative dots pattern ──
    ctx.fillStyle = "#e2e8f0";
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(350 + i * 15, 540, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(750 + i * 15, 540, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    return canvas;
}

export function downloadCertificate(canvas: HTMLCanvasElement, studentName: string) {
    const link = document.createElement("a");
    link.download = `Certificate_${studentName.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}
