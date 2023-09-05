const express = require("express");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

const router = express.Router();

router
   .route("/")
   .get((req, res) => {
      res.status(200).json(projects);
   })
   .post((req, res) => {
      const newProject = { uuid: uuidv4(), ...req.body };
      projects.push(newProject);
      res.status(201).json(newProject);
   });

router.route("/deleteAll").delete((req, res) => {
   // removing all projects from the collection
   projects.length = 0;
   res.status(200).json(projects);
});

router
   .route("/:uuidProject")
   .get((req, res) => {
      const project = projects.filter((project) => {
         return project.uuid === req.params.uuidProject;
      });
      project.length === 0 ? res.status(404).json({}) : res.status(200).json(project[0]);
   })
   .delete((req, res) => {
      const index = projects.findIndex((item) => {
         return item.uuid === req.params.uuidProject;
      });

      if (index !== -1) {
         deletedProject = projects.splice(index, 1);
         res.status(200).json({ deletedProject });
      } else {
         res.status(404).json({});
      }

      res.status(200).json({});
   });

router.route("/deleteAll").delete((req, res) => {
   // removing all projects from the collection
   projects.length = 0;
   res.status(200).json(projects);
});

router
   .route("/:uuidProject/router/:uuidRouter")
   .get((req, res) => {
      const projectIndex = projects.findIndex((item) => {
         return item.uuid === req.params.uuidProject;
      });

      if (projectIndex === -1) {
         res.status(404).json({ Error: "Project not found" });
      } else {
         const routerIndex = projects[projectIndex].routers.findIndex((item) => {
            return item.uuid === req.params.uuidRouter;
         });
         if (routerIndex === -1) {
            res.status(404).json({ Error: "Router not found" });
         } else {
            res.status(200).json(projects[projectIndex].routers[routerIndex]);
         }
      }
   })
   .patch((req, res) => {
      const projectIndex = projects.findIndex((item) => {
         return item.uuid === req.params.uuidProject;
      });

      if (projectIndex === -1) {
         res.status(404).json({ Error: "Project not found" });
      } else {
         const routerIndex = projects[projectIndex].routers.findIndex((item) => {
            return item.uuid === req.params.uuidRouter;
         });
         if (routerIndex === -1) {
            res.status(404).json({ Error: "Router not found" });
         } else {
            patchedRouter = { ...projects[projectIndex].routers[routerIndex], ...req.body };
            projects[projectIndex].routers[routerIndex] = patchedRouter;
            res.status(200).json(patchedRouter);
         }
      }
   })
   .delete((req, res) => {
      const projectIndex = projects.findIndex((item) => {
         return item.uuid === req.params.uuidProject;
      });

      if (projectIndex === -1) {
         res.status(404).json({ Error: "Project not found" });
      } else {
         const routerIndex = projects[projectIndex].routers.findIndex((item) => {
            return item.uuid === req.params.uuidRouter;
         });
         if (routerIndex === -1) {
            res.status(404).json({ Error: "Router not found" });
         } else {
            deletedRouter = projects[projectIndex].routers.splice(routerIndex, 1);
            res.status(200).json(deletedRouter[0]);
         }
      }
   });

router.route("/:uuidProject/router/:uuidRouter/live-status/exec/any").post((req, res) => {
   const projectIndex = projects.findIndex((item) => {
      return item.uuid === req.params.uuidProject;
   });

   if (projectIndex === -1) {
      res.status(404).json({ Error: "Project not found" });
   } else {
      const routerIndex = projects[projectIndex].routers.findIndex((item) => {
         return item.uuid === req.params.uuidRouter;
      });
      if (routerIndex === -1) {
         res.status(404).json({ Error: "Router not found" });
      } else {
         // supporting only ping

         if (req.body.input.args === undefined) {
            res.status(500).json({ Error: "Unsupported Payload" });
         }

         const args = req.body.input.args.split(" ");

         if (args.length !== 4) {
            res.status(500).json({
               Error: "Mockedup support for 'ping <address> source <address>' command format",
            });
         } else {
            // basic mockup assume the two interfaces are directly connected
            // check that args[1] interface exist and it is up
            // check that args[2] interface exist and it is up

            const interfaceIndex = projects[projectIndex].routers[routerIndex].intefaces.findIndex((item) => {
               return item.ip.includes(args[3]);
            });

            let destinationIsUp = undefined;

            for (const router of projects[projectIndex].routers) {
               for (const interface of router.intefaces) {
                  if (interface.ip.includes(args[1])) {
                     if ((interface.status = "up")) {
                        destinationIsUp = true;
                     } else {
                        destinationIsUp = false;
                     }
                  }
               }
            }

            if (interfaceIndex !== -1 && destinationIsUp === true) {
               if (projects[projectIndex].routers[routerIndex].intefaces[interfaceIndex].status === "up") {
                  res.status(200).json({
                     result: `Sending 5, 100-byte ICMP Echos to ${args[1]}, timeout is 2 seconds: Success rate is 100 percent (5/5), round-trip min/avg/max = 3/3/4 ms`,
                  });
               } else {
                  res.status(200).json({
                     result: `Sending 5, 100-byte ICMP Echos to ${args[1]}, timeout is 2 seconds: ..... Success rate is 0 percent (0/5)`,
                  });
               }
            } else {
               res.status(500).json({ Error: "Can not find source interface" });
            }
         }
      }
   }
});

router
   .route("/:uuidProject/router")
   .get((req, res) => {
      const projectIndex = projects.findIndex((item) => {
         return item.uuid === req.params.uuidProject;
      });

      if (projectIndex === -1) {
         res.status(404).json({ Error: "Project not found" });
      } else {
         res.status(200).json(projects[projectIndex].routers);
      }
   })
   .post((req, res) => {
      const projectIndex = projects.findIndex((item) => {
         return item.uuid === req.params.uuidProject;
      });

      if (projectIndex === -1) {
         res.status(404).json({ Error: "Project not found" });
      } else {
         const newRouter = { uuid: uuidv4(), ...req.body };
         projects[projectIndex].routers.push(newRouter);
         res.status(201).json(newRouter);
      }
   });

module.exports = router;
