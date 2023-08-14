const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const SERVER_DOMAIN = "http://localhost:4242";

const stripe = require("stripe")(
  "sk_test_51L3e7nSHAdMfPiwlMpsxYSJI6jXmTfTkhDDQ4mlZlCdwMTbB3GZb86sAPWDzXE46K4n94FtGbnqwhdsWfsarI11z00XbevbOUq"
);

app.post("/checkout", async (req, resp, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            images: [item.product],
          },
          unit_amount: item.price * 100 * 83,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${SERVER_DOMAIN}/success.html`,
      cancel_url: `${SERVER_DOMAIN}/cancel.html`,
    });
    resp.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

app.listen(4242, () => {
  console.log("server is running on port 4242");
});
