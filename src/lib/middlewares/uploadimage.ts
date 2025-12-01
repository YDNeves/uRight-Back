/**
 * BACKEND MIDDLEWARE CONCEPT (Node.js/Express Example)
 * ---------------------------------------------------
 *
 * Este ficheiro demonstra o 'Image Middleware' necessário no seu servidor
 * para receber o arquivo do frontend, processá-lo e salvá-lo num serviço de cloud.
 *
 * Dependências assumidas (você deve instalá-las):
 * - express
 * - multer (para lidar com upload de FormData)
 * - sharp (para processamento e redimensionamento de imagens)
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 1. Configuração do Multer
// O armazenamento em memória é usado para que o Sharp possa processar os dados binários
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
            (req as any).fileValidationError = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
        }
    }
});

// SIMULAÇÃO: Função que envia o Buffer processado para o Cloud Storage
async function uploadToCloudStorage(buffer: Buffer, filename: string): Promise<string> {
    // --- LÓGICA DO CLOUD STORAGE (S3, GCS, Cloudinary, etc.) ---
    
    // 1. Gerar o caminho final no cloud storage (ex: 'users/profile-123.webp')
    const finalPath = `uploads/images/${filename}`;

    // 2. SIMULAR o upload real (neste exemplo, apenas retornamos o URL)
    // Na vida real, aqui você usaria o SDK do seu provedor (ex: s3.upload({Body: buffer, Key: finalPath}).promise())

    console.log(`[SIMULAÇÃO] Arquivo pronto para upload: ${finalPath}, Tamanho: ${buffer.length} bytes`);
    
    // 3. Retornar o URL público (adaptar ao seu domínio real)
    return `https://cdn.seudominio.com/${finalPath}`; 
}


// 2. O Middleware de Processamento Principal
export const imageUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Usamos 'upload.single' para processar o campo 'file' do FormData
    upload.single('file')(req, res, async (err:any) => {
        if (err) {
            // Erro do Multer (ex: tamanho do arquivo, tipo de arquivo)
            console.error('Erro no Multer:', err);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        try {
            const originalName = path.parse(req.file.originalname).name;
            const uniqueId = uuidv4();

            // 3. PROCESSAMENTO AVANÇADO com Sharp
            // Cria uma versão otimizada (ex: 400x400) e a converte para WebP (formato web moderno)
            const processedBuffer = await sharp(req.file.buffer)
                .resize(400, 400, {
                    fit: sharp.fit.cover, // Garante que a imagem cobre a área 400x400
                    withoutEnlargement: true // Não aumenta se for menor que 400x400
                })
                .webp({ quality: 80 }) // Compressão e conversão para WebP
                .toBuffer();

            // 4. ARMAZENAMENTO NO CLOUD
            const filename = `${originalName}-${uniqueId}.webp`;
            const imageUrl = await uploadToCloudStorage(processedBuffer, filename);

            // 5. ANEXAR O URL ao objeto de requisição para uso na rota principal
            (req as any).imageUrl = imageUrl;
            
            // 6. Resposta Direta (Rota de Upload)
            // Em vez de passar para a próxima rota, é comum responder diretamente aqui
            // com o URL, pois o frontend espera a resposta do `/api/upload-image`.
            return res.status(200).json({ imageUrl: imageUrl });

        } catch (error) {
            console.error('Erro no Processamento Sharp/Upload:', error);
            return res.status(500).json({ error: 'Falha no processamento ou armazenamento da imagem.' });
        }
    });
};

// Exemplo de como você usaria isso na sua rota de API
/*
import express from 'express';
import { imageUploadMiddleware } from './middleware/imageUploadMiddleware';

const app = express();

app.post('/api/upload-image', 
    // Middleware de Autenticação (deve ser o primeiro)
    (req, res, next) => {
        // Lógica para verificar o token JWT e obter o req.userId
        next(); 
    },
    // Middleware de Upload de Imagem
    imageUploadMiddleware
);
*/