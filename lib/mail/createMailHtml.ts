const createMailHtml = (content: string): string => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>B-Side Festival 2025</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f57773; }
    table { border-spacing: 0; border-collapse: collapse; }
    .email-wrapper { width: 100%; background-color: #f57773; }
    .email-container {
      width: 90%;
      margin: 20px auto;
      background-color: #e9e9e9;
      border-radius: 4px;
      padding: 20px;
      font-family: "Ubuntu", sans-serif;
      font-size: 16px;
      color: #000;
      line-height: 1.5;
    }
    .header {
      background-color: #818387;
      color: #ededed;
      font-weight: 700;
      font-size: 20px;
      padding: 20px 15px;
      text-align: left;
      font-family: "Ubuntu", sans-serif;
    }
    .footer-text {
      color: #4d5c6b;
      font-size: 12px;
      margin: 20px;
    }
    .divider {
      border-top: 1px solid #374151;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <center class="email-wrapper">
    <table width="100%" class="header"><tr><td width="600" style="font-family: sans-serif; padding: 30px;">B-Side Festival 2025</td></tr></table>
    <table width="100%" class="email-container"><tr><td>
      ${content}
      <div class="divider"></div>
      <p class="footer-text">
        Diese E-Mail wurde automatisch generiert, bitte antworten Sie nicht auf sie. Verwende dafür stattdessen
        <a href="mailto:festival@b-side.ms" style="color: #4d5c6b;">festival@b-side.ms</a>.
      </p>
    </td></tr></table>
  </center>
</body>
</html>
`;

export default createMailHtml;
