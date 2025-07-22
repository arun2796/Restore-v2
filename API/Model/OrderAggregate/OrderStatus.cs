namespace API.Model.OrderAggregate;

public enum OrderStatus
{
    pending,
    paymentReceived,
    paymentFailed,

    paymentMismatch

}
