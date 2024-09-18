import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import QrCode from '../QrCode/index';
import style from './header.scss';

export default function Header() {
  return (
    <div className={style["header-nav"]}>
      <div className={style["header-left"]}>
        <div className={style["guide"]}>
          <h2>涂鸦即艺术，一键部署 AI 实时绘板 <span className={style['tips']}><a href="https://fcnext.console.aliyun.com/" target="_blank">阿里云函数计算FC</a>提供计算资源</span></h2>
        </div>
        <div className={style["copy-writing"]}>
          {/* <img src={paintLogo} alt="paint" /> */}
          <p>
            <Tooltip
              placement="right"
              title={
                <ul className={style["billing-overview"]} style={{ padding: 12, margin: 0 }}>
                  <li>使用本页面生图将会消耗阿里云函数计算资源，配置为16GB T4 GPU + 8核 vCPU + 32GB 内存。</li>
                  <li>例如生成每张图尺寸约512*512 预计消耗时间约 10秒。首次生成图片需要额外资源冷启动费用约为 1.5元，同时生成4张图约为1.7元；之后每张图预计消耗费用约为0.05元，同时生成4张约为 0.2元</li>
                  <li>首次新开通函数计算用户即可领取每月15万CU试用额度，3个月有效，即每月可用本页面免费生图约80张，超出额度即按量付费</li>
                  <li>实际使用会因图片质量有差异，了解更多费用请点击<a href="https://help.aliyun.com/zh/functioncompute/fc-3-0/product-overview/billing-overview-1?spm=5176.137990.J_5253785160.7.36551608fWS3a4" target="_blank">计费详情</a></li>
                </ul>
              }
            >
              <Typography.Text>
                计费说明 <QuestionCircleOutlined />
              </Typography.Text>
            </Tooltip>
          </p>

        </div>
      </div>
      <div className={style["header-right"]}>
        <QrCode />
        <div>
          <div>1</div>
          <div>选择风格</div>
          <span>-</span>
        </div>
        <div>
          <div>2</div>
          <div>输入提示词</div>
          <span>-</span>
        </div>
        <div>
          <div>3</div>
          <div>在左边画板上涂鸦</div>
        </div>
      </div>
    </div>
  )
}
