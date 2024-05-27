import { FormattedMessage } from 'react-intl'

import { OneInchLogo } from '@zeal/uikit/Icon/1inchLogo'
import { AaveLogo } from '@zeal/uikit/Icon/AaveLogo'
import { BungeeLogo } from '@zeal/uikit/Icon/BungeeLogo'
import { CompoundLogo } from '@zeal/uikit/Icon/CompoundLogo'
import { JumperLogo } from '@zeal/uikit/Icon/JumperLogo'
import { LidoLogo } from '@zeal/uikit/Icon/LidoLogo'
import { OdosLogo } from '@zeal/uikit/Icon/OdosLogo'
import { PancakeSwapLogo } from '@zeal/uikit/Icon/PancakeSwapLogo'
import { StargateLogo } from '@zeal/uikit/Icon/StargateLogo'
import { UniSwapLogo } from '@zeal/uikit/Icon/UniSwapLogo'

import { PlaceholderApp } from './index'

export const BROWSE_MORE_DAPPS_URL =
    'https://dappradar.com/rankings/category/defi?chains=ethereum%2Cbnb-chain%2Cpolygon%2Cavalanche%2Cmoonbeam%2Cfantom%2Ccelo%2Coptimism%2Caurora%2Carbitrum%2Czksync-era%2Cbase%2Clinea'

export const placeholderDapps: PlaceholderApp[] = [
    {
        logo: (size: number) => <AaveLogo size={size} />,
        name: 'Aave',
        description: (
            <FormattedMessage
                id="placeholderDapps.aave.descriotion"
                defaultMessage="Lend tokens at ~9% APY return"
            />
        ),
        link: 'https://aave.com/',
    },
    {
        logo: (size: number) => <CompoundLogo size={size} />,
        name: 'Compound',
        description: (
            <FormattedMessage
                id="placeholderDapps.compound.descriotion"
                defaultMessage="Lend tokens at ~9% APY return"
            />
        ),
        link: 'https://compound.finance/',
    },
    {
        logo: (size: number) => <StargateLogo size={size} />,
        name: 'Stargate',
        description: (
            <FormattedMessage
                id="placeholderDapps.stargate.descriotion"
                defaultMessage="Bridge or Stake for <14% APY"
            />
        ),
        link: 'https://stargate.finance/',
    },
    {
        logo: (size: number) => <PancakeSwapLogo size={size} />,
        name: 'PancakeSwap',
        description: (
            <FormattedMessage
                id="placeholderDapps.pancakeswap.descriotion"
                defaultMessage="One of the most popular exchanges"
            />
        ),
        link: 'https://pancakeswap.finance/',
    },
    {
        logo: (size: number) => <UniSwapLogo size={size} />,
        name: 'Uniswap',
        description: (
            <FormattedMessage
                id="placeholderDapps.uniswap.descriotion"
                defaultMessage="One of the most popular exchanges"
            />
        ),
        link: 'https://uniswap.org/',
    },
    {
        logo: (size: number) => <OdosLogo size={size} />,
        name: 'Odos',
        description: (
            <FormattedMessage
                id="placeholderDapps.odos.descriotion"
                defaultMessage="Exchange using the best routes"
            />
        ),
        link: 'https://www.odos.xyz/',
    },
    {
        logo: (size: number) => <OneInchLogo size={size} />,
        name: '1inch Exchange',
        description: (
            <FormattedMessage
                id="placeholderDapps.1inch.descriotion"
                defaultMessage="Exchange using the best routes"
            />
        ),
        link: 'https://1inch.io/',
    },
    {
        logo: (size: number) => <JumperLogo size={size} />,
        name: 'Jumper Exchange',
        description: (
            <FormattedMessage
                id="placeholderDapps.jumper.descriotion"
                defaultMessage="Bridge networks via the best routes"
            />
        ),
        link: 'https://jumper.exchange/',
    },
    {
        logo: (size: number) => <BungeeLogo size={size} />,
        name: 'Bungee Exchange',
        description: (
            <FormattedMessage
                id="placeholderDapps.bungee.descriotion"
                defaultMessage="Bridge networks via the best routes"
            />
        ),
        link: 'https://www.bungee.exchange/?intro=true',
    },
    {
        logo: (size: number) => <LidoLogo size={size} />,
        name: 'Lido',
        description: (
            <FormattedMessage
                id="placeholderDapps.lido.descriotion"
                defaultMessage="Stake ETH for ~3.2% APY"
            />
        ),
        link: 'https://lido.fi/',
    },
]
