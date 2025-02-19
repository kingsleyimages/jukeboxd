const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // const widgets = await fetchWidgets();
    res.send('widgets');
  } catch (error) {
    next(error);
  }
});
module.exports = router;
