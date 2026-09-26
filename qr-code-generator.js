document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("qr-code-form");
  const contentInput = document.getElementById("qr-content");
  const contentError = document.getElementById("qr-content-error");

  const result = document.getElementById("qr-result");
  const qrContainer = document.getElementById("qr-code");

  const downloadButton = document.getElementById("download-qr");
  const clearButton = document.getElementById("clear-qr");

  const summaryType = document.getElementById("summary-qr-type");
  const summaryLength = document.getElementById("summary-qr-length");
  const resultText = document.getElementById("qr-result-text");

  let qrCodeInstance = null;

  function clearError() {
    contentError.textContent = "";
    contentError.hidden = true;
  }

  function detectContentType(text) {
    const trimmed = text.trim();

    if (/^https?:\/\/\S+$/i.test(trimmed)) {
      return "Website URL";
    }

    if (/^mailto:/i.test(trimmed)) {
      return "Email Address";
    }

    if (/^tel:/i.test(trimmed)) {
      return "Phone Number";
    }

    if (
      /^(WIFI|BEGIN:VCARD|BEGIN:VEVENT)/i.test(trimmed)
    ) {
      return "Structured Information";
    }

    return "Text";
  }

  function generateQRCode(text) {
    qrContainer.innerHTML = "";

    qrCodeInstance = new QRCode(qrContainer, {
      text: text,
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function getQRCodeImage() {
    const image = qrContainer.querySelector("img");

    if (image && image.src) {
      return image.src;
    }

    const canvas = qrContainer.querySelector("canvas");

    if (canvas) {
      return canvas.toDataURL("image/png");
    }

    return null;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    clearError();

    const text = contentInput.value.trim();

    if (!text) {
      contentError.textContent =
        "Please enter some text or a URL to generate a QR code.";

      contentError.hidden = false;

      result.hidden = true;

      contentInput.focus();

      return;
    }

    if (text.length > 2000) {
      contentError.textContent =
        "Please keep the content within 2,000 characters.";

      contentError.hidden = false;

      result.hidden = true;

      return;
    }

    if (typeof QRCode === "undefined") {
      contentError.textContent =
        "The QR Code generator could not be loaded. Please refresh the page and try again.";

      contentError.hidden = false;

      result.hidden = true;

      return;
    }

    try {
      generateQRCode(text);

      const contentType = detectContentType(text);

      summaryType.textContent = contentType;

      summaryLength.textContent =
        `${text.length} characters`;

      resultText.innerHTML =
        `Your QR code has been generated from <strong>${contentType.toLowerCase()}</strong>. You can download the QR code as a PNG image.`;

      result.hidden = false;

      setTimeout(() => {
        result.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);

    } catch (error) {
      console.error(
        "QR Code generation error:",
        error
      );

      contentError.textContent =
        "The QR code could not be generated. Please check your content and try again.";

      contentError.hidden = false;

      result.hidden = true;
    }
  });

  downloadButton.addEventListener("click", () => {
    if (result.hidden) {
      return;
    }

    const imageSource = getQRCodeImage();

    if (!imageSource) {
      return;
    }

    const link = document.createElement("a");

    link.href = imageSource;
    link.download = "calclyworld-qr-code.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  });

  clearButton.addEventListener("click", () => {
    contentInput.value = "";

    clearError();

    qrContainer.innerHTML = "";

    result.hidden = true;

    summaryType.textContent = "—";
    summaryLength.textContent = "—";

    resultText.textContent = "";

    qrCodeInstance = null;

    contentInput.focus();
  });
});