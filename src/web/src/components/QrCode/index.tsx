import React, { useEffect, useState, useRef } from 'react';
import * as qrcode from 'qrcode';
import { Image } from 'antd';
import style from './style.scss';

const QrCode: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | undefined>(undefined);

    // 组件加载时生成二维码
    useEffect(() => {
        const currentDomain = window.location.origin;

        const generateQRCode = async () => {
            if (canvasRef.current) {
                try {
                    await qrcode.toCanvas(canvasRef.current, currentDomain, {
                        width: 200,
                        height: 200,
                        margin: 2
                    });

                    // 将生成的二维码转换为 Data URL
                    const dataUrl = canvasRef.current.toDataURL();
                    setQrCodeDataUrl(dataUrl);
                } catch (error) {
                    console.error('Error generating QR code:', error);
                }
            }
        };

        generateQRCode();
    }, []);

    return (
        <div className={style['qr-code-container']}>
            <p className={style['qr-code-tips']}>点击并扫描二维码在手机上使用</p>
            {qrCodeDataUrl && (
                <Image
                    src={qrCodeDataUrl}
                    width={50}
                    height={50}
                />
            )}
            <canvas ref={canvasRef} id="qr-code-canvas" style={{ display: 'none' }}></canvas>
        </div>
    );
};

export default QrCode;