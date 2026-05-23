import Reservation from '../models/reservation.js';

export const handleWebhookService =
    async (event) => {

        if (
            event.event !==
            'transaction.updated'
        ) {
            return;
        }

        const transaction =
            event.data.transaction;

        const reservation =
            await Reservation.findOne({
                where: {
                    payment_id:
                        transaction.id,
                },
            });

        if (!reservation) {

            throw new Error(
                'Reserva no encontrada'
            );
        }

        switch (transaction.status) {

            case 'APPROVED':

                reservation.payment_status =
                    'approved';

                reservation.estado =
                    'Activa';

                break;

            case 'DECLINED':

                reservation.payment_status =
                    'declined';

                reservation.estado =
                    'Cancelada';

                break;

            case 'ERROR':

                reservation.payment_status =
                    'error';

                reservation.estado =
                    'Cancelada';

                break;

            case 'PENDING':

                reservation.payment_status =
                    'pending';

                break;
        }

        await reservation.save();

        return reservation;
    };