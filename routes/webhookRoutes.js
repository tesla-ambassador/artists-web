const express = require("express");
const { handleSupabaseWebhook } = require("../controllers/webhookController");

const router = express.Router();

router.post("/supabase", handleSupabaseWebhook); // POST /api/webhooks/supabase

module.exports = router;
