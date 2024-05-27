import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { format } from 'date-fns'

import { Avatar, Badge } from '@zeal/uikit/Avatar'
import { Chain } from '@zeal/uikit/Chain'
import { Alcohol } from '@zeal/uikit/Icon/MCC/Alcohol'
import { Appliances } from '@zeal/uikit/Icon/MCC/Appliances'
import { Bank } from '@zeal/uikit/Icon/MCC/Bank'
import { Billiard } from '@zeal/uikit/Icon/MCC/Billiard'
import { Books } from '@zeal/uikit/Icon/MCC/Books'
import { Bowling } from '@zeal/uikit/Icon/MCC/Bowling'
import { Car } from '@zeal/uikit/Icon/MCC/Car'
import { CarRepair } from '@zeal/uikit/Icon/MCC/CarRepair'
import { CarWash } from '@zeal/uikit/Icon/MCC/CarWash'
import { Casino } from '@zeal/uikit/Icon/MCC/Casino'
import { Cellular } from '@zeal/uikit/Icon/MCC/Cellular'
import { Charity } from '@zeal/uikit/Icon/MCC/Charity'
import { Cigarette } from '@zeal/uikit/Icon/MCC/Cigarette'
import { Cinema } from '@zeal/uikit/Icon/MCC/Cinema'
import { Cleaning } from '@zeal/uikit/Icon/MCC/Cleaning'
import { Clothes } from '@zeal/uikit/Icon/MCC/Clothes'
import { Construction } from '@zeal/uikit/Icon/MCC/Construction'
import { Cosmetics } from '@zeal/uikit/Icon/MCC/Cosmetics'
import { Delivery } from '@zeal/uikit/Icon/MCC/Delivery'
import { Dentist } from '@zeal/uikit/Icon/MCC/Dentist'
import { Drugs } from '@zeal/uikit/Icon/MCC/Drugs'
import { Education } from '@zeal/uikit/Icon/MCC/Education'
import { Electricity } from '@zeal/uikit/Icon/MCC/Electricity'
import { Fitness } from '@zeal/uikit/Icon/MCC/Fitness'
import { Flights } from '@zeal/uikit/Icon/MCC/Flights'
import { Flowers } from '@zeal/uikit/Icon/MCC/Flowers'
import { Food } from '@zeal/uikit/Icon/MCC/Food'
import { Fuel } from '@zeal/uikit/Icon/MCC/Fuel'
import { Furniture } from '@zeal/uikit/Icon/MCC/Furniture'
import { Games } from '@zeal/uikit/Icon/MCC/Games'
import { Gas } from '@zeal/uikit/Icon/MCC/Gas'
import { Gifts } from '@zeal/uikit/Icon/MCC/Gifts'
import { Government } from '@zeal/uikit/Icon/MCC/Government'
import { Hotel } from '@zeal/uikit/Icon/MCC/Hotel'
import { Housing } from '@zeal/uikit/Icon/MCC/Housing'
import { Internet } from '@zeal/uikit/Icon/MCC/Internet'
import { Kids } from '@zeal/uikit/Icon/MCC/Kids'
import { Laundry } from '@zeal/uikit/Icon/MCC/Laundry'
import { Luxuries } from '@zeal/uikit/Icon/MCC/Luxuries'
import { Magazines } from '@zeal/uikit/Icon/MCC/Magazines'
import { Media } from '@zeal/uikit/Icon/MCC/Media'
import { Medicine } from '@zeal/uikit/Icon/MCC/Medicine'
import { MusicalInstruments } from '@zeal/uikit/Icon/MCC/MusicalInstruments'
import { Optics } from '@zeal/uikit/Icon/MCC/Optics'
import { Other } from '@zeal/uikit/Icon/MCC/Other'
import { Parking } from '@zeal/uikit/Icon/MCC/Parking'
import { Pets } from '@zeal/uikit/Icon/MCC/Pets'
import { PublicTransport } from '@zeal/uikit/Icon/MCC/PublicTransport'
import { Purchase } from '@zeal/uikit/Icon/MCC/Purchase'
import { ShoeRepair } from '@zeal/uikit/Icon/MCC/ShoeRepair'
import { Sport } from '@zeal/uikit/Icon/MCC/Sport'
import { SportingGoods } from '@zeal/uikit/Icon/MCC/SportingGoods'
import { Stationary } from '@zeal/uikit/Icon/MCC/Stationary'
import { Taxes } from '@zeal/uikit/Icon/MCC/Taxes'
import { Taxi } from '@zeal/uikit/Icon/MCC/Taxi'
import { Telephony } from '@zeal/uikit/Icon/MCC/Telephony'
import { TollRoad } from '@zeal/uikit/Icon/MCC/TollRoad'
import { Toys } from '@zeal/uikit/Icon/MCC/Toys'
import { TrafficFine } from '@zeal/uikit/Icon/MCC/TrafficFine'
import { Train } from '@zeal/uikit/Icon/MCC/Train'
import { TravelAgency } from '@zeal/uikit/Icon/MCC/TravelAgency'
import { TV } from '@zeal/uikit/Icon/MCC/TV'
import { WaterTransport } from '@zeal/uikit/Icon/MCC/WaterTransport'
import { SpamFolder } from '@zeal/uikit/Icon/SpamFolder'
import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { UnknownMerchantCode } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FormattedFiatCurrency2 } from '@zeal/domains/Money/components/FormattedFiatCurrency'

import { CardTransaction } from '..'

type Props = {
    transaction: CardTransaction
}

export const TransactionListItem = ({ transaction }: Props) => {
    useEffect(() => {
        getKnownMerchantCodeCategory(transaction.merchant.mcc).mapError(
            (code) => captureError(new UnknownMerchantCode(code))
        )
    }, [transaction.merchant.mcc])

    switch (transaction.kind) {
        case 'Payment':
            const trxDate = format(transaction.createdAt, `HH:MM`)
            const trxTitle = (
                <FormattedFiatCurrency2
                    minimumFractionDigits={0}
                    money={transaction.billingAmount}
                />
            )

            const trxSubtitle = transaction.transactionAmount &&
                transaction.transactionAmount.currency.id !==
                    transaction.billingAmount.currency.id && (
                    <FormattedFiatCurrency2
                        minimumFractionDigits={0}
                        money={transaction.transactionAmount}
                    />
                )

            switch (transaction.status) {
                case 'Approved':
                    return (
                        <ListItem
                            avatar={({ size }) => (
                                <Avatar
                                    backgroundColor="iconDefault"
                                    size={size}
                                >
                                    <MerchantAvatarIcon
                                        size={size}
                                        transaction={transaction}
                                    />
                                </Avatar>
                            )}
                            aria-current={false}
                            size="regular"
                            primaryText={transaction.merchant.name}
                            shortText={trxDate}
                            side={{
                                title: trxTitle,
                                subtitle: trxSubtitle,
                            }}
                        />
                    )
                case 'InsufficientFunds':
                    return (
                        <ListItem
                            avatar={({ size }) => (
                                <Avatar
                                    backgroundColor="iconDefault"
                                    leftBadge={({ size }) => (
                                        <Badge
                                            outlineColor="surfaceDefault"
                                            backgroundColor="backgroundStatusWarning"
                                            size={size}
                                        >
                                            <SpamFolder
                                                size={size}
                                                color="surfaceDefault"
                                            />
                                        </Badge>
                                    )}
                                    size={size}
                                >
                                    <MerchantAvatarIcon
                                        size={size}
                                        transaction={transaction}
                                    />
                                </Avatar>
                            )}
                            aria-current={false}
                            size="regular"
                            primaryText={transaction.merchant.name}
                            shortText={
                                <Chain>
                                    {trxDate}
                                    <FormattedMessage
                                        defaultMessage="Insufficient balance"
                                        id="cards.transactions.status.insufficient_balance"
                                    />
                                </Chain>
                            }
                            side={{
                                title: (
                                    <Text textDecorationLine="line-through">
                                        {trxTitle}
                                    </Text>
                                ),
                                subtitle: trxSubtitle && (
                                    <Text textDecorationLine="line-through">
                                        {trxSubtitle}
                                    </Text>
                                ),
                            }}
                        />
                    )

                case 'Declined':
                    return (
                        <ListItem
                            avatar={({ size }) => (
                                <Avatar
                                    backgroundColor="iconDefault"
                                    leftBadge={({ size }) => (
                                        <Badge
                                            outlineColor="surfaceDefault"
                                            backgroundColor="backgroundStatusWarning"
                                            size={size}
                                        >
                                            <SpamFolder
                                                size={size}
                                                color="surfaceDefault"
                                            />
                                        </Badge>
                                    )}
                                    size={size}
                                >
                                    <MerchantAvatarIcon
                                        size={size}
                                        transaction={transaction}
                                    />
                                </Avatar>
                            )}
                            aria-current={false}
                            size="regular"
                            primaryText={transaction.merchant.name}
                            shortText={
                                <Chain>
                                    {trxDate}
                                    <FormattedMessage
                                        defaultMessage="Declined"
                                        id="cards.transactions.status.declined"
                                    />
                                </Chain>
                            }
                            side={{
                                title: (
                                    <Text textDecorationLine="line-through">
                                        {trxTitle}
                                    </Text>
                                ),
                                subtitle: trxSubtitle && (
                                    <Text textDecorationLine="line-through">
                                        {trxSubtitle}
                                    </Text>
                                ),
                            }}
                        />
                    )

                case 'Reversal':
                    return (
                        <ListItem
                            avatar={({ size }) => (
                                <Avatar
                                    backgroundColor="iconDefault"
                                    leftBadge={({ size }) => (
                                        <Badge
                                            outlineColor="surfaceDefault"
                                            backgroundColor="backgroundStatusWarning"
                                            size={size}
                                        >
                                            <SpamFolder
                                                size={size}
                                                color="surfaceDefault"
                                            />
                                        </Badge>
                                    )}
                                    size={size}
                                >
                                    <MerchantAvatarIcon
                                        size={size}
                                        transaction={transaction}
                                    />
                                </Avatar>
                            )}
                            aria-current={false}
                            size="regular"
                            primaryText={transaction.merchant.name}
                            shortText={
                                <Chain>
                                    {trxDate}
                                    <FormattedMessage
                                        defaultMessage="Reversal"
                                        id="cards.transactions.status.reversal"
                                    />
                                </Chain>
                            }
                            side={{
                                title: (
                                    <Text textDecorationLine="line-through">
                                        {trxTitle}
                                    </Text>
                                ),
                                subtitle: trxSubtitle && (
                                    <Text textDecorationLine="line-through">
                                        {trxSubtitle}
                                    </Text>
                                ),
                            }}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(transaction.status)
            }

        case 'Refund': {
            const trxDate = format(transaction.createdAt, `HH:MM`)
            const trxTitle = (
                <FormattedFiatCurrency2
                    minimumFractionDigits={0}
                    money={transaction.billingAmount}
                />
            )

            const trxSubtitle = transaction.transactionAmount &&
                transaction.transactionAmount.currency.id !==
                    transaction.billingAmount.currency.id && (
                    <FormattedFiatCurrency2
                        minimumFractionDigits={0}
                        money={transaction.transactionAmount}
                    />
                )

            return (
                <ListItem
                    avatar={({ size }) => (
                        <Avatar backgroundColor="iconDefault" size={size}>
                            <MerchantAvatarIcon
                                size={size}
                                transaction={transaction}
                            />
                        </Avatar>
                    )}
                    aria-current={false}
                    size="regular"
                    primaryText={transaction.merchant.name}
                    shortText={
                        <Chain>
                            {trxDate}
                            <FormattedMessage
                                defaultMessage="Refund"
                                id="cards.transactions.status.refund"
                            />
                        </Chain>
                    }
                    side={{
                        title: trxTitle,
                        subtitle: trxSubtitle,
                    }}
                />
            )
        }

        case 'Reversal': {
            const trxDate = format(transaction.createdAt, `HH:MM`)
            const trxTitle = (
                <FormattedFiatCurrency2
                    minimumFractionDigits={0}
                    money={transaction.billingAmount}
                />
            )

            const trxSubtitle = transaction.transactionAmount &&
                transaction.transactionAmount.currency.id !==
                    transaction.billingAmount.currency.id && (
                    <FormattedFiatCurrency2
                        minimumFractionDigits={0}
                        money={transaction.transactionAmount}
                    />
                )

            return (
                <ListItem
                    avatar={({ size }) => (
                        <Avatar backgroundColor="iconDefault" size={size}>
                            <MerchantAvatarIcon
                                size={size}
                                transaction={transaction}
                            />
                        </Avatar>
                    )}
                    aria-current={false}
                    size="regular"
                    primaryText={transaction.merchant.name}
                    shortText={
                        <Chain>
                            {trxDate}
                            <FormattedMessage
                                defaultMessage="Reversal"
                                id="cards.transactions.status.reversal"
                            />
                        </Chain>
                    }
                    side={{
                        title: trxTitle,
                        subtitle: trxSubtitle,
                    }}
                />
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

type KnownMerchantCodeCategories =
    | 'cars'
    | 'carWash'
    | 'tollRoad'
    | 'trafficFine'
    | 'parking'
    | 'fuel'
    | 'autoRepair'
    | 'charity'
    | 'financialInstitutions'
    | 'alcohol'
    | 'cigarette'
    | 'casino'
    | 'kids'
    | 'toys'
    | 'furniture'
    | 'construction'
    | 'laundry'
    | 'stationary'
    | 'shoeRepair'
    | 'cleaning'
    | 'appliances'
    | 'pets'
    | 'games'
    | 'cinema'
    | 'magazines'
    | 'musicalInstruments'
    | 'media'
    | 'hotel'
    | 'travelAgency'
    | 'billiard'
    | 'bowling'
    | 'sport'
    | 'luxuries'
    | 'fitness'
    | 'housing'
    | 'gas'
    | 'electricity'
    | 'medicine'
    | 'drugs'
    | 'dentist'
    | 'optics'
    | 'taxes'
    | 'government'
    | 'books'
    | 'education'
    | 'clothes'
    | 'food'
    | 'purchases'
    | 'gifts'
    | 'flowers'
    | 'flights'
    | 'train'
    | 'taxi'
    | 'publicTransport'
    | 'delivery'
    | 'waterTransport'
    | 'sportingGoods'
    | 'cosmetics'
    | 'telephony'
    | 'internet'
    | 'cellular'
    | 'tv'
    | 'insurance'
    | 'other'

// all categories https://www.citibank.com/tts/solutions/commercial-cards/assets/docs/govt/Merchant-Category-Codes.pdf
// https://usa.visa.com/content/dam/VCOM/download/merchants/visa-merchant-data-standards-manual.pdf
const getKnownMerchantCodeCategory = (
    merchantCode: number
): Result<number, KnownMerchantCodeCategories> => {
    switch (true) {
        case merchantCode >= 3000 && merchantCode <= 3299:
            return success('flights')
        case merchantCode >= 3356 && merchantCode <= 3440:
            return success('cars')
        case merchantCode >= 3501 && merchantCode <= 3790:
            return success('hotel')
        case merchantCode >= 3551 && merchantCode <= 3555:
        case merchantCode >= 3560 && merchantCode <= 3564:
        case merchantCode >= 3582 && merchantCode <= 3796:
            return success('casino')
        case merchantCode >= 4011 && merchantCode <= 4119:
            return success('train')
        case merchantCode === 4111:
            return success('publicTransport')
        case merchantCode === 4121:
            return success('taxi')
        case merchantCode >= 4214 && merchantCode <= 4215:
            return success('delivery')
        case merchantCode >= 4411 && merchantCode <= 4468:
            return success('waterTransport')
        case merchantCode === 4722:
            return success('travelAgency')
        case merchantCode === 4784:
            return success('tollRoad')
        case merchantCode === 4812:
            return success('electricity')
        case merchantCode >= 4814 && merchantCode <= 4816:
            return success('telephony')
        case merchantCode === 4815:
            return success('cellular')
        case merchantCode === 4816:
            return success('internet')
        case merchantCode === 4899:
            return success('tv')
        case merchantCode === 4900:
            return success('gas')
        case merchantCode === 5039:
            return success('construction')
        case merchantCode === 5122:
        case merchantCode === 5912:
            return success('drugs')
        case merchantCode === 5192:
            return success('magazines')
        case merchantCode === 5812:
        case merchantCode === 5411:
        case merchantCode === 5441:
        case merchantCode >= 5412 && merchantCode <= 5499:
            return success('food')
        case merchantCode === 5542:
        case merchantCode === 5983:
            return success('fuel')
        case merchantCode >= 5611 && merchantCode <= 5699:
            return success('clothes')
        case merchantCode === 5641:
            return success('kids')
        case merchantCode === 5712:
            return success('furniture')
        case merchantCode === 5722:
            return success('appliances')
        case merchantCode === 5733:
            return success('musicalInstruments')
        case merchantCode === 5813:
            return success('alcohol')
        case merchantCode === 5815:
            return success('media')
        case merchantCode === 5816:
            return success('games')
        case merchantCode === 5832:
            return success('cinema')
        case merchantCode === 5941:
            return success('sportingGoods')
        case merchantCode === 5942:
            return success('books')
        case merchantCode === 5943:
            return success('stationary')
        case merchantCode === 5944:
            return success('luxuries')
        case merchantCode === 5945:
            return success('toys')
        case merchantCode === 5947:
            return success('gifts')
        case merchantCode === 5977:
            return success('cosmetics')
        case merchantCode === 5992:
            return success('flowers')
        case merchantCode === 5993:
            return success('cigarette')
        case merchantCode === 5995:
            return success('pets')
        case merchantCode >= 6010 && merchantCode <= 6012:
            return success('financialInstitutions')
        case merchantCode >= 6300 && merchantCode <= 6399:
            return success('insurance')
        case merchantCode === 6513:
            return success('housing')
        case merchantCode >= 7210 && merchantCode <= 7217:
            return success('laundry')
        case merchantCode === 7251:
            return success('shoeRepair')
        case merchantCode === 7298:
            return success('fitness')
        case merchantCode === 7349:
            return success('cleaning')
        case merchantCode === 7523:
            return success('parking')
        case merchantCode === 7531:
        case merchantCode === 7534:
            return success('autoRepair')
        case merchantCode === 7542:
            return success('carWash')
        case merchantCode === 7801:
        case merchantCode === 7995:
            return success('casino')
        case merchantCode === 7932:
            return success('billiard')
        case merchantCode === 7933:
            return success('bowling')
        case merchantCode === 7997:
            return success('sport')
        case merchantCode >= 8011 && merchantCode <= 8099:
            return success('medicine')
        case merchantCode === 8021:
            return success('dentist')
        case merchantCode === 8042:
            return success('optics')
        case merchantCode === 8299:
            return success('education')
        case merchantCode === 8398:
            return success('charity')
        case merchantCode === 9222:
            return success('trafficFine')
        case merchantCode === 9311:
            return success('taxes')
        case merchantCode === 9399:
            return success('government')

        case merchantCode === 7299: // Miscellaneous Stores - Other Services–Not Elsewhere Classified
        case merchantCode === 7999: // Recreation Services–Not Elsewhere Classified
        case merchantCode === 5262:
            return success('purchases')
        default:
            return failure(merchantCode)
    }
}

const MerchantAvatarIcon = ({
    transaction,
    size,
}: Props & { size: number }) => {
    const merchantCodes = getKnownMerchantCodeCategory(transaction.merchant.mcc)

    switch (merchantCodes.type) {
        case 'Failure':
            return <Purchase color="surfaceDefault" size={size} />
        case 'Success':
            switch (merchantCodes.data) {
                case 'cars':
                    return <Car color="surfaceDefault" size={size} />
                case 'carWash':
                    return <CarWash color="surfaceDefault" size={size} />
                case 'tollRoad':
                    return <TollRoad color="surfaceDefault" size={size} />
                case 'trafficFine':
                    return <TrafficFine color="surfaceDefault" size={size} />
                case 'parking':
                    return <Parking color="surfaceDefault" size={size} />
                case 'fuel':
                    return <Fuel color="surfaceDefault" size={size} />
                case 'autoRepair':
                    return <CarRepair color="surfaceDefault" size={size} />
                case 'charity':
                    return <Charity color="surfaceDefault" size={size} />
                case 'financialInstitutions':
                    return <Bank color="surfaceDefault" size={size} />
                case 'alcohol':
                    return <Alcohol color="surfaceDefault" size={size} />
                case 'cigarette':
                    return <Cigarette color="surfaceDefault" size={size} />
                case 'casino':
                    return <Casino color="surfaceDefault" size={size} />
                case 'purchases':
                    return <Purchase color="surfaceDefault" size={size} />
                case 'kids':
                    return <Kids color="surfaceDefault" size={size} />
                case 'toys':
                    return <Toys color="surfaceDefault" size={size} />
                case 'furniture':
                    return <Furniture color="surfaceDefault" size={size} />
                case 'construction':
                    return <Construction color="surfaceDefault" size={size} />
                case 'laundry':
                    return <Laundry color="surfaceDefault" size={size} />
                case 'stationary':
                    return <Stationary color="surfaceDefault" size={size} />
                case 'shoeRepair':
                    return <ShoeRepair color="surfaceDefault" size={size} />
                case 'cleaning':
                    return <Cleaning color="surfaceDefault" size={size} />
                case 'appliances':
                    return <Appliances color="surfaceDefault" size={size} />
                case 'pets':
                    return <Pets color="surfaceDefault" size={size} />
                case 'games':
                    return <Games color="surfaceDefault" size={size} />
                case 'cinema':
                    return <Cinema color="surfaceDefault" size={size} />
                case 'magazines':
                    return <Magazines color="surfaceDefault" size={size} />
                case 'musicalInstruments':
                    return (
                        <MusicalInstruments
                            color="surfaceDefault"
                            size={size}
                        />
                    )
                case 'media':
                    return <Media color="surfaceDefault" size={size} />
                case 'hotel':
                    return <Hotel color="surfaceDefault" size={size} />
                case 'travelAgency':
                    return <TravelAgency color="surfaceDefault" size={size} />
                case 'billiard':
                    return <Billiard color="surfaceDefault" size={size} />
                case 'bowling':
                    return <Bowling color="surfaceDefault" size={size} />
                case 'sport':
                    return <Sport color="surfaceDefault" size={size} />
                case 'luxuries':
                    return <Luxuries color="surfaceDefault" size={size} />
                case 'fitness':
                    return <Fitness color="surfaceDefault" size={size} />
                case 'housing':
                    return <Housing color="surfaceDefault" size={size} />
                case 'gas':
                    return <Gas color="surfaceDefault" size={size} />
                case 'electricity':
                    return <Electricity color="surfaceDefault" size={size} />
                case 'medicine':
                    return <Medicine color="surfaceDefault" size={size} />
                case 'drugs':
                    return <Drugs color="surfaceDefault" size={size} />
                case 'dentist':
                    return <Dentist color="surfaceDefault" size={size} />
                case 'optics':
                    return <Optics color="surfaceDefault" size={size} />
                case 'taxes':
                    return <Taxes color="surfaceDefault" size={size} />
                case 'government':
                    return <Government color="surfaceDefault" size={size} />
                case 'books':
                    return <Books color="surfaceDefault" size={size} />
                case 'education':
                    return <Education color="surfaceDefault" size={size} />
                case 'clothes':
                    return <Clothes color="surfaceDefault" size={size} />
                case 'food':
                    return <Food color="surfaceDefault" size={size} />
                case 'gifts':
                    return <Gifts color="surfaceDefault" size={size} />
                case 'flowers':
                    return <Flowers color="surfaceDefault" size={size} />
                case 'flights':
                    return <Flights color="surfaceDefault" size={size} />
                case 'train':
                    return <Train color="surfaceDefault" size={size} />
                case 'taxi':
                    return <Taxi color="surfaceDefault" size={size} />
                case 'publicTransport':
                    return (
                        <PublicTransport color="surfaceDefault" size={size} />
                    )
                case 'delivery':
                    return <Delivery color="surfaceDefault" size={size} />
                case 'waterTransport':
                    return <WaterTransport color="surfaceDefault" size={size} />
                case 'sportingGoods':
                    return <SportingGoods color="surfaceDefault" size={size} />
                case 'cosmetics':
                    return <Cosmetics color="surfaceDefault" size={size} />
                case 'telephony':
                    return <Telephony color="surfaceDefault" size={size} />
                case 'internet':
                    return <Internet color="surfaceDefault" size={size} />
                case 'cellular':
                    return <Cellular color="surfaceDefault" size={size} />
                case 'tv':
                    return <TV color="surfaceDefault" size={size} />
                case 'insurance':
                    return <TravelAgency color="surfaceDefault" size={size} />
                case 'other':
                    return <Other color="surfaceDefault" size={size} />
                default:
                    return notReachable(merchantCodes.data)
            }
        /* istanbul ignore next */
        default:
            return notReachable(merchantCodes)
    }
}
