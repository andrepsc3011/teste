function doPost(e) {
    const folderId = "1O-Oa78MaMDPTnFHX1-BON9Lyqq9wkKxD"; // Substitua pelo ID da pasta no Google Drive
    const sheetId = "10U4M3vOQJq52tpYP84tZmVoCASfDF4fyz7zidU2RJzY"; // Substitua pelo ID da planilha no Google Sheets

    try {
        // Obter parâmetros da requisição
        const blob = Utilities.newBlob(JSON.parse(e.postData.contents), e.parameter.mimeType, e.parameter.filename);
        const tipo = e.parameter.tipo;
        const placa = e.parameter.placa;

        // Salvar arquivo no Google Drive
        const folder = DriveApp.getFolderById(folderId);
        const file = folder.createFile(blob);

        // Gerar timestamp
        const timestamp = new Date();

        // Abrir a planilha e calcular o próximo ID
        const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
        const lastRow = sheet.getLastRow(); // Última linha preenchida
        const nextId = lastRow > 1 ? lastRow - 1 : 1; // ID = Número da linha - 1 (considerando o cabeçalho)

        // Criar link para o arquivo
        const fileLink = `=HYPERLINK("${file.getUrl()}"; "${file.getName()}")`;

        // Salvar dados na planilha
        sheet.appendRow([nextId, tipo, placa, fileLink, timestamp]);

        // Retornar resposta ao cliente
        const responseObj = {
            filename: file.getName(),
            fileUrl: file.getUrl()
        };
        return ContentService.createTextOutput(JSON.stringify(responseObj)).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
    }
}
