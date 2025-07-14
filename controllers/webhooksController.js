const { prisma } = require("../lib/db");

const handleSupabaseWebhook = async (req, res) => {
  try {
    const { event, user } = req.body;

    // Only handle 'USER_SIGNUP' or 'USER_UPDATED' events
    if (event !== "USER_SIGNUP" && event !== "USER_UPDATED") {
      return res.status(200).send("Event ignored");
    }

    const { email, user_metadata } = user;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          name: user_metadata?.name || "Unnamed User",
          picture: user_metadata?.picture || null,
          preferred_username: user_metadata?.preferred_username || null,
          is_artist: false,
        },
      });
    }

    res.status(200).send("User synced");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = { handleSupabaseWebhook };
