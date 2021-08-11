const  Router =  require("express");

const AsyncRouter = (options) => {
  const router = Router(options);
  const handle = async (fn, req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((e) => {
      if (!res.headerSent) {
        next(e);
      }
    });
  };

  router.getAsync = (route, fn) => {
    router.get(route, async (req, res, next) => {
      await handle(fn, req, res, next);
    });
  };

  router.postAsync = (route, fn) => {
    router.post(route, async (req, res, next) => {
      await handle(fn, req, res, next);
    });
  };

  router.putAsync = (route, fn) => {
    router.put(route, async (req, res, next) => {
      await handle(fn, req, res, next);
    });
  };

  router.deleteAsync = (route, fn) => {
    router.delete(route, async (req, res, next) => {
      await handle(fn, req, res, next);
    });
  };

  return router;
};

module.exports = AsyncRouter;
