/**
 * ============================================================================
 *  CONTENIDO DE LA GUÍA DMS — ÚNICA FUENTE DE VERDAD
 * ============================================================================
 *
 *  Todo el texto visible se escribe con T(es, en, pt).
 *   - Si dejas `en` o `pt` vacío ('' o null) se traduce automáticamente
 *     desde el español con LanguageApp y se guarda en caché.
 *     => Para un cambio rápido basta con escribir en español.
 *   - Cuando quieras una traducción revisada, escríbela y reemplaza a la automática.
 *   - Ejecuta `listMissingTranslations()` en el editor para ver qué falta.
 *
 *  Marcado permitido dentro de los textos:
 *    `codigo`            -> código en línea (nunca se traduce)
 *    **negrita**         -> negrita
 *    [texto](https://…)  -> enlace (abre en pestaña nueva)
 *
 *  Para publicar cambios: Implementar > Administrar implementaciones >
 *  Editar (lápiz) > Versión: "Nueva versión" > Implementar.
 *  (Así la URL /exec que está en Google Sites NO cambia.)
 * ============================================================================
 */

function T(es, en, pt) {
  return { es: es, en: en || null, pt: pt || null };
}

var LINKS = {
  productApi: 'https://app.swaggerhub.com/apis-docs/openapi-cmos/CMOS-Clear-ProductAPI/4.0.0',
  dmsApi: 'https://app.swaggerhub.com/apis-docs/openapi-cmos/DMS-ERP/4.0.0',
  sandbox: 'https://oasandbox.somosclear.com/',
  email: 'openapi@clearcheck.us'
};

/* --------------------------------------------------------------------------
 *  CATÁLOGO DE ENDPOINTS (se reutiliza en flujos, referencia y checklist)
 *  El enlace "Docs" apunta a la operación exacta en SwaggerHub (tag + operationId).
 * -------------------------------------------------------------------------- */
function getEndpoints_() {
  // E(id, método, ruta, dir, grupo, integración, tag SwaggerHub, operationId, descripción)
  //   dir:   'dms2cm' = el DMS llama a ClearMechanic (CM Product API)
  //          'cm2dms' = ClearMechanic llama al DMS (webhooks / Guía DMS)
  //   integ: 'std' = integración estándar (citas, OR, cotizaciones)
  //          'crm' = integración CRM (clientes, vehículos, tareas)
  //          'planner' = Planeador de Taller (trabajos de citas y órdenes)
  //          'extra' = adicionales, se habilitan según el alcance acordado
  function E(id, m, p, dir, group, integ, tag, op, d) {
    return { id: id, m: m, p: p, dir: dir, group: group, integ: integ, core: integ === 'std', tag: tag, op: op, d: d };
  }
  var D = 'dms2cm', W = 'cm2dms';
  return [
    // ===================== CM Product API (DMS -> CM) =====================
    E('login', 'POST', '/users/login', D, 'auth', 'std', 'Authentication', 'userLogin',
      T('Obtiene el JWT (accessToken) para consumir la CM Product API.', 'Obtains the JWT (accessToken) used to call the CM Product API.', 'Obtém o JWT (accessToken) para consumir a CM Product API.')),
    // Catálogos
    E('cmAdvisors', 'GET', '/cm/serviceAdvisors', D, 'catalogs', 'std', 'Users', 'getServiceAdvisorsCM',
      T('Asesores de servicio de ClearMechanic con sus IDs. Solo si no se usa `serviceAdvisorExternalId`.', 'ClearMechanic service advisors and their IDs. Only needed if `serviceAdvisorExternalId` is not used.', 'Consultores técnicos do ClearMechanic com seus IDs. Somente se `serviceAdvisorExternalId` não for usado.')),
    E('cmUsers', 'GET', '/cm/users', D, 'catalogs', 'std', 'Users', 'getCmUsers',
      T('Usuarios de ClearMechanic. Solo si no se usa `userWhoScheduleExternalId`.', 'ClearMechanic users. Only needed if `userWhoScheduleExternalId` is not used.', 'Usuários do ClearMechanic. Somente se `userWhoScheduleExternalId` não for usado.')),
    E('cmReasons', 'GET', '/cm/appointmentReasons', D, 'catalogs', 'std', 'Appointments', 'getAppointmentReasonsCM',
      T('Motivos de cita estándar (`appointmentReasonId`).', 'Standard appointment reasons (`appointmentReasonId`).', 'Motivos de agendamento padrão (`appointmentReasonId`).')),
    E('cmCustomReasons', 'GET', '/cm/customReasons', D, 'catalogs', 'std', 'Appointments', 'getCustomReasonsCM',
      T('Motivos de cita personalizados del dashboard. Si devuelve datos, el dashboard usa `customReasons`.', 'Dashboard-specific custom appointment reasons. If it returns data, the dashboard uses `customReasons`.', 'Motivos de agendamento personalizados do dashboard. Se retornar dados, o dashboard usa `customReasons`.')),
    E('cmPhases', 'GET', '/cm/phases', D, 'catalogs', 'std', 'Orders', 'getCmPhases',
      T('Fases de la OR. El ID (int) se usa en el campo `phase` al crear la OR.', 'RO phases. The ID (int) is used in the `phase` field when creating an RO.', 'Fases da OS. O ID (int) é usado no campo `phase` ao criar a OS.')),
    E('cmReasonCreate', 'POST', '/cm/appointmentReasons', D, 'catalogs', 'extra', 'Appointments', 'createAppointmentReasonCM',
      T('Crea un motivo de cita en ClearMechanic.', 'Creates an appointment reason in ClearMechanic.', 'Cria um motivo de agendamento no ClearMechanic.')),
    E('cmMobility', 'GET', '/cm/mobilityOptions', D, 'catalogs', 'extra', 'Appointments', 'getMobilityOptions',
      T('Opciones de movilidad para la cita.', 'Mobility options for the appointment.', 'Opções de mobilidade para o agendamento.')),
    E('cmApptOrigins', 'GET', '/cm/v1/appointmentOrigins', D, 'catalogs', 'extra', 'Appointments', 'getAppointmentOrigins',
      T('Orígenes de cita.', 'Appointment origins.', 'Origens de agendamento.')),
    E('cmAbsences', 'GET', '/cm/absences', D, 'catalogs', 'extra', 'Users', 'getCmAbsences',
      T('Ausencias de usuarios.', 'User absences.', 'Ausências de usuários.')),
    // Citas
    E('cmApptCreate', 'POST', '/cm/v2/appointments', D, 'appointments', 'std', 'Appointments', 'createAppointmentV2',
      T('Crea una cita en ClearMechanic.', 'Creates an appointment in ClearMechanic.', 'Cria um agendamento no ClearMechanic.')),
    E('cmApptUpdate', 'PATCH', '/cm/appointments/{appointmentNumber}', D, 'appointments', 'std', 'Appointments', 'updateAppointmentCM',
      T('Actualiza una cita existente en ClearMechanic.', 'Updates an existing appointment in ClearMechanic.', 'Atualiza um agendamento existente no ClearMechanic.')),
    E('cmApptDelete', 'DELETE', '/cm/appointments/{appointmentNumber}', D, 'appointments', 'std', 'Appointments', 'deleteAppointmentCM',
      T('Elimina una cita en ClearMechanic.', 'Deletes an appointment in ClearMechanic.', 'Exclui um agendamento no ClearMechanic.')),
    E('cmApptList', 'GET', '/cm/appointments', D, 'appointments', 'extra', 'Appointments', 'getAppointmentsCM',
      T('Listado de citas en ClearMechanic.', 'List of appointments in ClearMechanic.', 'Lista de agendamentos no ClearMechanic.')),
    E('cmApptGet', 'GET', '/cm/appointments/{appointmentNumber}', D, 'appointments', 'extra', 'Appointments', 'getAppointmentCMById',
      T('Detalle de una cita en ClearMechanic.', 'Detail of an appointment in ClearMechanic.', 'Detalhe de um agendamento no ClearMechanic.')),
    E('cmSchedule', 'GET', '/cm/scheduleAvailability', D, 'appointments', 'extra', 'Appointments', 'getScheduleAvailability',
      T('Disponibilidad de horarios para agendar.', 'Schedule availability for booking.', 'Disponibilidade de horários para agendar.')),
    E('cmAdvisorSchedule', 'GET', '/cm/serviceAdvisors/{serviceAdvisorId}/availableSchedule', D, 'appointments', 'extra', 'Users', 'getServiceAdvisorScheduleCM',
      T('Horario disponible de un asesor.', 'Available schedule of an advisor.', 'Horário disponível de um consultor.')),
    // Órdenes
    E('cmOrderCreate', 'POST', '/cm/v2/orders', D, 'orders', 'std', 'Orders', 'createOrderCMV2',
      T('Crea una OR en ClearMechanic (versión recomendada).', 'Creates an RO in ClearMechanic (recommended version).', 'Cria uma OS no ClearMechanic (versão recomendada).')),
    E('cmOrderUpdate', 'PATCH', '/cm/v2/orders/{orderNumber}', D, 'orders', 'std', 'Orders', 'updateOrderV2CM',
      T('Actualiza una OR existente en ClearMechanic.', 'Updates an existing RO in ClearMechanic.', 'Atualiza uma OS existente no ClearMechanic.')),
    E('cmOrderClose', 'PUT', '/cm/orders/{orderNumber}/close', D, 'orders', 'std', 'Orders', 'closeOrder',
      T('Cierra una OR en ClearMechanic (p. ej. al facturar).', 'Closes an RO in ClearMechanic (e.g. upon invoicing).', 'Fecha uma OS no ClearMechanic (ex.: ao faturar).')),
    E('cmOrderList', 'GET', '/cm/v2/orders', D, 'orders', 'extra', 'Orders', 'getOrderCMV2',
      T('Listado de OR en ClearMechanic.', 'List of ROs in ClearMechanic.', 'Lista de OS no ClearMechanic.')),
    E('cmOrderGet', 'GET', '/cm/v2/orders/{orderNumber}', D, 'orders', 'extra', 'Orders', 'GetOrderV2CM',
      T('Detalle de una OR en ClearMechanic.', 'Detail of an RO in ClearMechanic.', 'Detalhe de uma OS no ClearMechanic.')),
    E('cmOrderReopen', 'PUT', '/cm/orders/{orderNumber}/reopen', D, 'orders', 'extra', 'Orders', 'reopenOrder',
      T('Reabre una OR cerrada.', 'Reopens a closed RO.', 'Reabre uma OS fechada.')),
    E('cmOrderAttach', 'POST', '/cm/orders/{orderNumber}/attachments', D, 'orders', 'extra', 'Orders', 'uploadOrderAttachmentCM',
      T('Sube un archivo adjunto a la OR.', 'Uploads an attachment to the RO.', 'Envia um anexo para a OS.')),
    E('cmOrderVisit', 'POST', '/cm/orders/{orderNumber}/visitReasons', D, 'orders', 'extra', 'Orders', 'postVisitReasons',
      T('Agrega motivos de visita a la OR.', 'Adds visit reasons to the RO.', 'Adiciona motivos de visita à OS.')),
    E('cmOrderPhases', 'GET', '/cm/orders/{orderNumber}/phaseHistory', D, 'orders', 'extra', 'Orders', 'getOrderPhaseHistory',
      T('Historial de fases de la OR.', 'Phase history of the RO.', 'Histórico de fases da OS.')),
    E('cmOrderLog', 'GET', '/cm/orders/{orderNumber}/activityLog', D, 'orders', 'extra', 'Orders', 'getOrderActivityLog',
      T('Bitácora de actividad de la OR.', 'Activity log of the RO.', 'Log de atividades da OS.')),
    E('cmOrderPay', 'POST', '/cm/orders/{orderNumber}/payments', D, 'orders', 'extra', 'Orders', 'postOrderPayment',
      T('Registra un pago de la OR.', 'Registers an RO payment.', 'Registra um pagamento da OS.')),
    // Puntos de inspección / cotización en CM
    E('cmInspCreate', 'POST', '/cm/orders/{orderNumber}/inspectionItems', D, 'quotes', 'extra', 'Orders', 'postInspectionItems',
      T('Agrega puntos de inspección a una OR existente.', 'Adds inspection items to an existing RO.', 'Adiciona pontos de inspeção a uma OS existente.')),
    E('cmInspPatch', 'PATCH', '/cm/orders/{orderNumber}/inspectionItems/{inspectionItemId}', D, 'quotes', 'extra', 'Orders', 'patchInspectionItem',
      T('Actualiza un punto de inspección.', 'Updates an inspection item.', 'Atualiza um ponto de inspeção.')),
    E('cmInspMedia', 'GET', '/cm/orders/{orderNumber}/inspectionItems/{inspectionItemId}/media', D, 'quotes', 'extra', 'Orders', 'getInspectionItemMedia',
      T('Fotos y videos de un punto de inspección.', 'Photos and videos of an inspection item.', 'Fotos e vídeos de um ponto de inspeção.')),
    E('cmEstCreate', 'POST', '/cm/orders/{orderNumber}/inspectionItems/{inspectionItemId}/estimates', D, 'quotes', 'extra', 'Orders', 'postInspectionItemEstimate',
      T('Agrega una estimación a un punto de inspección.', 'Adds an estimate to an inspection item.', 'Adiciona uma estimativa a um ponto de inspeção.')),
    E('cmEstPatch', 'PATCH', '/cm/orders/{orderNumber}/inspectionItems/{inspectionItemId}/estimates/{estimateId}', D, 'quotes', 'extra', 'Orders', 'patchInspectionItemEstimate',
      T('Actualiza una estimación.', 'Updates an estimate.', 'Atualiza uma estimativa.')),
    E('cmEstDelete', 'DELETE', '/cm/orders/{orderNumber}/inspectionItems/{inspectionItemId}/estimates/{estimateId}', D, 'quotes', 'extra', 'Orders', 'deleteInspectionItemEstimate',
      T('Elimina una estimación.', 'Deletes an estimate.', 'Exclui uma estimativa.')),
    // CRM — clientes, vehículos, tareas
    E('cmCustCreate', 'POST', '/cm/customers', D, 'customers', 'crm', 'Customers', 'createCustomerCM',
      T('Crea un cliente en ClearMechanic.', 'Creates a customer in ClearMechanic.', 'Cria um cliente no ClearMechanic.')),
    E('cmCustList', 'GET', '/cm/customers', D, 'customers', 'crm', 'Customers', 'getCustomersCM',
      T('Búsqueda de clientes en ClearMechanic.', 'Customer search in ClearMechanic.', 'Busca de clientes no ClearMechanic.')),
    E('cmCustGet', 'GET', '/cm/customers/{customerId}', D, 'customers', 'crm', 'Customers', 'getCustomerCMById',
      T('Detalle de un cliente.', 'Detail of a customer.', 'Detalhe de um cliente.')),
    E('cmCustUpdate', 'PATCH', '/cm/customers/{customerId}', D, 'customers', 'crm', 'Customers', 'updateCustomerCM',
      T('Actualiza un cliente.', 'Updates a customer.', 'Atualiza um cliente.')),
    E('cmVehCreate', 'POST', '/cm/vehicles', D, 'vehicles', 'crm', 'Vehicles', 'createVehicleCM',
      T('Crea un vehículo en ClearMechanic.', 'Creates a vehicle in ClearMechanic.', 'Cria um veículo no ClearMechanic.')),
    E('cmVehList', 'GET', '/cm/vehicles', D, 'vehicles', 'crm', 'Vehicles', 'getVehiclesCM',
      T('Búsqueda de vehículos en ClearMechanic.', 'Vehicle search in ClearMechanic.', 'Busca de veículos no ClearMechanic.')),
    E('cmVehGet', 'GET', '/cm/vehicles/{vehicleId}', D, 'vehicles', 'crm', 'Vehicles', 'getVehicleCMById',
      T('Detalle de un vehículo.', 'Detail of a vehicle.', 'Detalhe de um veículo.')),
    E('cmVehUpdate', 'PATCH', '/cm/vehicles/{vehicleId}', D, 'vehicles', 'crm', 'Vehicles', 'updateVehicleCM',
      T('Actualiza un vehículo.', 'Updates a vehicle.', 'Atualiza um veículo.')),
    E('cmVehOwner', 'PUT', '/cm/vehicles/{vehicleId}/vehicleOwner', D, 'vehicles', 'crm', 'Vehicles', 'updateVehicleOwner',
      T('Cambia el propietario del vehículo.', 'Changes the vehicle owner.', 'Altera o proprietário do veículo.')),
    E('cmVehContactAdd', 'POST', '/cm/vehicles/{vehicleId}/contacts', D, 'vehicles', 'crm', 'Vehicles', 'addVehicleContact',
      T('Agrega un contacto al vehículo.', 'Adds a contact to the vehicle.', 'Adiciona um contato ao veículo.')),
    E('cmVehContactDel', 'DELETE', '/cm/vehicles/{vehicleId}/contacts/{contactId}', D, 'vehicles', 'crm', 'Vehicles', 'deleteVehicleContact',
      T('Elimina un contacto del vehículo.', 'Removes a contact from the vehicle.', 'Remove um contato do veículo.')),
    E('cmTaskPrio', 'GET', '/cm/v1/taskPriorities', D, 'tasks', 'crm', 'Tasks', 'getTaskPriorities',
      T('Catálogo de prioridades de tarea.', 'Task priority catalog.', 'Catálogo de prioridades de tarefa.')),
    E('cmTaskTypes', 'GET', '/cm/v1/taskTypes', D, 'tasks', 'crm', 'Tasks', 'getTaskTypes',
      T('Catálogo de tipos de tarea.', 'Task type catalog.', 'Catálogo de tipos de tarefa.')),
    E('cmTaskPurposes', 'GET', '/cm/v1/taskPurposes', D, 'tasks', 'crm', 'Tasks', 'getTaskPurposes',
      T('Catálogo de propósitos de tarea.', 'Task purpose catalog.', 'Catálogo de finalidades de tarefa.')),
    E('cmTaskCreate', 'POST', '/cm/tasks', D, 'tasks', 'crm', 'Tasks', 'createTaskCM',
      T('Crea una tarea en el tablero de ClearMechanic.', 'Creates a task on the ClearMechanic board.', 'Cria uma tarefa no quadro do ClearMechanic.')),
    E('cmTaskList', 'GET', '/cm/tasks', D, 'tasks', 'crm', 'Tasks', 'getTasksCM',
      T('Listado de tareas en ClearMechanic.', 'List of tasks in ClearMechanic.', 'Lista de tarefas no ClearMechanic.')),
    E('cmTaskGet', 'GET', '/cm/tasks/{taskId}', D, 'tasks', 'crm', 'Tasks', 'getTaskByIdCM',
      T('Detalle de una tarea.', 'Detail of a task.', 'Detalhe de uma tarefa.')),
    E('cmTaskUpdate', 'PATCH', '/cm/tasks/{taskId}', D, 'tasks', 'crm', 'Tasks', 'updateTaskCM',
      T('Actualiza una tarea.', 'Updates a task.', 'Atualiza uma tarefa.')),
    // Planeador de Taller
    E('cmPlannings', 'GET', '/cm/plannings', D, 'planner', 'planner', 'WorkshopPlanner', 'getPlannings',
      T('Planeaciones configuradas en ClearMechanic.', 'Plannings configured in ClearMechanic.', 'Planejamentos configurados no ClearMechanic.')),
    E('cmOrderJobs', 'GET', '/cm/orders/{orderNumber}/jobs', D, 'planner', 'planner', 'WorkshopPlanner', 'getOrderJobs',
      T('Trabajos de una OR.', 'Jobs of an RO.', 'Serviços de uma OS.')),
    E('cmOrderJobCreate', 'POST', '/cm/orders/{orderNumber}/jobs', D, 'planner', 'planner', 'WorkshopPlanner', 'createOrderJob',
      T('Crea una planificación a partir de un trabajo de la OR (duración estimada y puntos de inspección).', 'Creates a planning from an RO job (estimated duration and inspection items).', 'Cria um planejamento a partir de um serviço da OS (duração estimada e pontos de inspeção).')),
    E('cmOrderJobUpdate', 'PATCH', '/cm/orders/{orderNumber}/jobs/{jobId}', D, 'planner', 'planner', 'WorkshopPlanner', 'updateOrderJob',
      T('Actualiza un trabajo de la OR.', 'Updates an RO job.', 'Atualiza um serviço da OS.')),
    E('cmOrderJobDelete', 'DELETE', '/cm/orders/{orderNumber}/jobs/{jobId}', D, 'planner', 'planner', 'WorkshopPlanner', 'deleteOrderJob',
      T('Elimina un trabajo de la OR.', 'Deletes an RO job.', 'Exclui um serviço da OS.')),
    E('cmApptJobCreate', 'POST', '/cm/appointments/{appointmentNumber}/jobs', D, 'planner', 'planner', 'WorkshopPlanner', 'createAppointmentJob',
      T('Crea un trabajo para una cita.', 'Creates a job for an appointment.', 'Cria um serviço para um agendamento.')),
    E('cmApptJobUpdate', 'PATCH', '/cm/appointments/{appointmentNumber}/jobs/{jobId}', D, 'planner', 'planner', 'WorkshopPlanner', 'updateAppointmentJob',
      T('Actualiza un trabajo de la cita.', 'Updates an appointment job.', 'Atualiza um serviço do agendamento.')),
    E('cmApptJobDelete', 'DELETE', '/cm/appointments/{appointmentNumber}/jobs/{jobId}', D, 'planner', 'planner', 'WorkshopPlanner', 'deleteAppointmentJob',
      T('Elimina un trabajo de la cita.', 'Deletes an appointment job.', 'Exclui um serviço do agendamento.')),
    // Reportes
    E('cmDashboards', 'GET', '/cmos/dashboards', D, 'reports', 'extra', 'Reports', 'getCmDashboards',
      T('Dashboards (agencias/talleres) a los que tiene acceso el usuario.', 'Dashboards (dealerships/workshops) the user has access to.', 'Dashboards (concessionárias/oficinas) aos quais o usuário tem acesso.')),
    E('cmNotApproved', 'GET', '/cm/v1/getNotApproved/{vin}', D, 'reports', 'extra', 'Reports', 'getNotApproved',
      T('Trabajos no aprobados de un vehículo (por VIN).', 'Not-approved items of a vehicle (by VIN).', 'Itens não aprovados de um veículo (por VIN).')),
    E('cmInspList', 'GET', '/cm/v1/inspectionItemsList/{vin}', D, 'reports', 'extra', 'Reports', 'getInspectionItems',
      T('Historial de puntos de inspección de un vehículo (por VIN).', 'Inspection item history of a vehicle (by VIN).', 'Histórico de pontos de inspeção de um veículo (por VIN).')),

    // ===================== Guía DMS (CM -> DMS) =====================
    // Estándar
    E('vehicles', 'GET', '/vehicles', W, 'vehicles', 'std', 'Vehicles', 'getVehicles',
      T('Busca vehículos por VIN o placa y devuelve datos del cliente y del vehículo. Crítico para crear OR desde la app móvil.', 'Searches vehicles by VIN or license plate and returns customer and vehicle data. Critical for RO creation from the mobile app.', 'Busca veículos por VIN ou placa e retorna dados do cliente e do veículo. Crítico para criar OS pelo app móvel.')),
    E('advisors', 'GET', '/advisors', W, 'users', 'std', 'Users', 'advisors',
      T('Lista de asesores de servicio disponibles en el DMS.', 'List of service advisors available in the DMS.', 'Lista de consultores técnicos disponíveis no DMS.')),
    E('invList', 'GET', '/inventoryItems', W, 'quotes', 'std', 'Inventory Items', 'getInventoryItems',
      T('Búsqueda por palabra clave: devuelve `jobs`, `parts` y `labors` con el detalle para cotizar, para que el asesor elija y agregue.', 'Keyword search: returns `jobs`, `parts` and `labors` with the detail needed to quote, so the advisor can pick and add them.', 'Busca por palavra-chave: retorna `jobs`, `parts` e `labors` com o detalhe para orçar, para o consultor escolher e adicionar.')),
    E('invItem', 'GET', '/inventoryItems/{itemId}', W, 'quotes', 'std', 'Inventory Items', 'getInventoryItemById',
      T('Agrega directo por ID: devuelve solo esa refacción o mano de obra cuando el asesor ya conoce su ID.', 'Add directly by ID: returns only that part or labor when the advisor already knows its ID.', 'Adiciona direto por ID: retorna apenas essa peça ou mão de obra quando o consultor já conhece o ID.')),
    E('apptCreate', 'POST', '/appointments', W, 'appointments', 'std', 'Appointments', 'createAppointment',
      T('ClearMechanic notifica la creación de una cita. Respuesta: `201 Created`.', 'ClearMechanic notifies an appointment creation. Response: `201 Created`.', 'O ClearMechanic notifica a criação de um agendamento. Resposta: `201 Created`.')),
    E('apptUpdate', 'PATCH', '/appointments/{appointmentId}', W, 'appointments', 'std', 'Appointments', 'updateAppointment',
      T('ClearMechanic notifica la actualización de una cita.', 'ClearMechanic notifies an appointment update.', 'O ClearMechanic notifica a atualização de um agendamento.')),
    E('apptDelete', 'DELETE', '/appointments/{appointmentId}', W, 'appointments', 'std', 'Appointments', 'deleteAppointment',
      T('ClearMechanic notifica la eliminación de una cita.', 'ClearMechanic notifies an appointment deletion.', 'O ClearMechanic notifica a exclusão de um agendamento.')),
    E('orderCreate', 'POST', '/orders', W, 'orders', 'std', 'Orders', 'createOrder',
      T('ClearMechanic notifica la creación de una OR; el DMS responde con el `orderNumber`.', 'ClearMechanic notifies an RO creation; the DMS responds with the `orderNumber`.', 'O ClearMechanic notifica a criação de uma OS; o DMS responde com o `orderNumber`.')),
    E('orderUpdate', 'PATCH', '/orders/{orderNumber}', W, 'orders', 'std', 'Orders', 'updateOrderById',
      T('ClearMechanic notifica la actualización de una OR.', 'ClearMechanic notifies an RO update.', 'O ClearMechanic notifica a atualização de uma OS.')),
    E('orderClose', 'PUT', '/orders/{orderNumber}/closeOrder', W, 'orders', 'std', 'Orders', 'closeOrder',
      T('ClearMechanic notifica el cierre de una OR.', 'ClearMechanic notifies an RO closure.', 'O ClearMechanic notifica o fechamento de uma OS.')),
    E('quotes', 'POST', '/quotes', W, 'quotes', 'std', 'Quotes', 'postQuotes',
      T('ClearMechanic envía la cotización completa de la OR cuando el asesor la finaliza (formato estándar).', 'ClearMechanic sends the complete RO quote once the advisor finalizes it (standard format).', 'O ClearMechanic envia o orçamento completo da OS quando o consultor o finaliza (formato padrão).')),
    // CRM
    E('custList', 'GET', '/customers', W, 'customers', 'crm', 'Customers', 'customers',
      T('Búsqueda de clientes en el DMS.', 'Customer search in the DMS.', 'Busca de clientes no DMS.')),
    E('custCreate', 'POST', '/customers', W, 'customers', 'crm', 'Customers', 'postCustomer',
      T('Crea un cliente en el DMS.', 'Creates a customer in the DMS.', 'Cria um cliente no DMS.')),
    E('custGet', 'GET', '/customers/{customerId}', W, 'customers', 'crm', 'Customers', 'customerById',
      T('Detalle de un cliente.', 'Detail of a customer.', 'Detalhe de um cliente.')),
    E('custUpdate', 'PATCH', '/customers/{customerId}', W, 'customers', 'crm', 'Customers', 'updateClient',
      T('Actualiza un cliente en el DMS.', 'Updates a customer in the DMS.', 'Atualiza um cliente no DMS.')),
    E('vehCreate', 'POST', '/vehicles', W, 'vehicles', 'crm', 'Vehicles', 'postVehicle',
      T('Crea un vehículo en el DMS.', 'Creates a vehicle in the DMS.', 'Cria um veículo no DMS.')),
    E('vehUpdate', 'PATCH', '/vehicles/{vehicleId}', W, 'vehicles', 'crm', 'Vehicles', 'updateVehicle',
      T('Actualiza un vehículo en el DMS.', 'Updates a vehicle in the DMS.', 'Atualiza um veículo no DMS.')),
    E('vehWarranties', 'GET', '/vehicles/{vin}/warranties', W, 'vehicles', 'crm', 'Vehicles', 'warranties',
      T('Garantías de un vehículo.', 'Warranties of a vehicle.', 'Garantias de um veículo.')),
    E('vehCampaigns', 'GET', '/vehicles/{vin}/campaigns', W, 'vehicles', 'crm', 'Vehicles', 'campaigns',
      T('Campañas (recalls) de un vehículo.', 'Campaigns (recalls) of a vehicle.', 'Campanhas (recalls) de um veículo.')),
    E('taskList', 'GET', '/tasks', W, 'tasks', 'crm', 'Tasks', 'getTasks',
      T('Obtiene todas las tareas del DMS.', 'Gets all DMS tasks.', 'Obtém todas as tarefas do DMS.')),
    E('taskCreate', 'POST', '/tasks', W, 'tasks', 'crm', 'Tasks', 'createTask',
      T('Crea una tarea en el DMS.', 'Creates a task in the DMS.', 'Cria uma tarefa no DMS.')),
    E('taskGet', 'GET', '/tasks/{taskId}', W, 'tasks', 'crm', 'Tasks', 'getTaskById',
      T('Obtiene una tarea por ID.', 'Gets a task by ID.', 'Obtém uma tarefa por ID.')),
    E('taskUpdate', 'PATCH', '/tasks/{taskId}', W, 'tasks', 'crm', 'Tasks', 'updateTask',
      T('Actualiza una tarea en el DMS.', 'Updates a task in the DMS.', 'Atualiza uma tarefa no DMS.')),
    // Planeador de Taller
    E('jobCreate', 'POST', '/jobs', W, 'planner', 'planner', 'Workshop Planner', 'createJob',
      T('Crea un trabajo relacionado a una OR o cita.', 'Creates a job related to an RO or appointment.', 'Cria um serviço relacionado a uma OS ou agendamento.')),
    E('jobUpdate', 'PATCH', '/jobs/{jobId}', W, 'planner', 'planner', 'Workshop Planner', 'updateJob',
      T('Edita un trabajo.', 'Updates a job.', 'Edita um serviço.')),
    E('jobDelete', 'DELETE', '/jobs/{jobId}', W, 'planner', 'planner', 'Workshop Planner', 'deleteJob',
      T('Elimina un trabajo.', 'Deletes a job.', 'Exclui um serviço.')),
    E('opCodes', 'GET', '/operationCodes', W, 'planner', 'planner', 'Workshop Planner', 'getOperationCodes',
      T('Datos de un código de operación según VIN y código.', 'Operation code data based on VIN and code.', 'Dados de um código de operação conforme VIN e código.')),
    E('apptJobs', 'GET', '/appointments/{appointmentId}/jobs', W, 'planner', 'planner', 'Appointments', 'jobs',
      T('Trabajos de una cita.', 'Jobs of an appointment.', 'Serviços de um agendamento.')),
    E('technicians', 'GET', '/technicians', W, 'planner', 'planner', 'Users', 'technicians',
      T('Listado de técnicos del DMS.', 'List of DMS technicians.', 'Lista de técnicos do DMS.')),
    // Adicionales
    E('inspQuotes', 'POST', '/inspectionItemsQuotes', W, 'quotes', 'extra', 'Quotes', 'postUnspectionItemsQuotes',
      T('Variante de `/quotes` que envía la cotización agrupada por puntos de inspección.', 'Variant of `/quotes` that sends the quote grouped by inspection points.', 'Variante de `/quotes` que envia o orçamento agrupado por pontos de inspeção.')),
    E('apptList', 'GET', '/appointments', W, 'appointments', 'extra', 'Appointments', 'appointments',
      T('Listado de citas del DMS.', 'List of DMS appointments.', 'Lista de agendamentos do DMS.')),
    E('apptGet', 'GET', '/appointments/{appointmentId}', W, 'appointments', 'extra', 'Appointments', 'appointment',
      T('Detalle de una cita del DMS.', 'Detail of a DMS appointment.', 'Detalhe de um agendamento do DMS.')),
    E('orderList', 'GET', '/orders', W, 'orders', 'extra', 'Orders', 'getOrders',
      T('Listado de OR del DMS.', 'List of DMS ROs.', 'Lista de OS do DMS.')),
    E('orderGet', 'GET', '/orders/{orderNumber}', W, 'orders', 'extra', 'Orders', 'getOrderById',
      T('Detalle de una OR del DMS.', 'Detail of a DMS RO.', 'Detalhe de uma OS do DMS.')),
    E('orderTypes', 'GET', '/orderTypes', W, 'orders', 'extra', 'Orders', 'orderTypes',
      T('Tipos de OR.', 'RO types.', 'Tipos de OS.')),
    E('visitReasons', 'POST', '/orders/{orderNumber}/visitReasons', W, 'orders', 'extra', 'Orders', 'postVisitReasons',
      T('Agrega un motivo de visita a la OR.', 'Adds a visit reason to the RO.', 'Adiciona um motivo de visita à OS.')),
    E('estCreate', 'POST', '/orders/{orderId}/estimates', W, 'quotes', 'extra', 'Estimates', 'postEstimateByOrderId',
      T('Agrega una cotización a una OR existente.', 'Adds an estimate to an existing RO.', 'Adiciona um orçamento a uma OS existente.')),
    E('estGet', 'GET', '/orders/{orderId}/estimates', W, 'quotes', 'extra', 'Estimates', 'getEstimateByOrderId',
      T('Obtiene la cotización de una OR.', 'Returns the estimate of an RO.', 'Retorna o orçamento de uma OS.')),
    E('estUpdate', 'PUT', '/orders/{orderId}/estimates', W, 'quotes', 'extra', 'Estimates', 'updateEstimateByOrderId',
      T('Actualiza la cotización de una OR.', 'Updates the estimate of an RO.', 'Atualiza o orçamento de uma OS.')),
    E('users', 'GET', '/users', W, 'users', 'extra', 'Users', 'users',
      T('Listado de usuarios del DMS.', 'List of DMS users.', 'Lista de usuários do DMS.')),
    E('offers', 'GET', '/offers', W, 'others', 'extra', 'Others', 'offers',
      T('Ofertas de la agencia o taller.', 'Offers of the dealership or workshop.', 'Ofertas da concessionária ou oficina.')),
    E('dealerships', 'GET', '/dealerships', W, 'others', 'extra', 'Others', 'dealerships',
      T('Listado de agencias o talleres.', 'List of dealerships or workshops.', 'Lista de concessionárias ou oficinas.'))
  ];
}

/* --------------------------------------------------------------------------
 *  TEXTOS DE INTERFAZ
 * -------------------------------------------------------------------------- */
function getUi_() {
  return {
    title: T('Guía de Integración DMS', 'DMS Integration Guide', 'Guia de Integração DMS'),
    version: T('Versión', 'Version', 'Versão'),
    updated: T('Actualizado', 'Updated', 'Atualizado'),
    prev: T('Anterior', 'Previous', 'Anterior'),
    next: T('Siguiente', 'Next', 'Próximo'),
    method: T('Método', 'Method', 'Método'),
    endpoint: T('Endpoint', 'Endpoint', 'Endpoint'),
    direction: T('Dirección', 'Direction', 'Direção'),
    description: T('Descripción', 'Description', 'Descrição'),
    field: T('Campo', 'Field', 'Campo'),
    type: T('Tipo', 'Type', 'Tipo'),
    required: T('Requerido', 'Required', 'Obrigatório'),
    yes: T('Sí', 'Yes', 'Sim'),
    no: T('No', 'No', 'Não'),
    conditional: T('Condicional', 'Conditional', 'Condicional'),
    docs: T('Docs', 'Docs', 'Docs'),
    openDocs: T('Ver en SwaggerHub', 'Open in SwaggerHub', 'Ver no SwaggerHub'),
    copy: T('Copiar', 'Copy', 'Copiar'),
    copied: T('¡Copiado!', 'Copied!', 'Copiado!'),
    play: T('Reproducir', 'Play', 'Reproduzir'),
    pause: T('Pausar', 'Pause', 'Pausar'),
    step: T('Paso', 'Step', 'Passo'),
    stepHint: T('Haz clic en un paso o usa las flechas para recorrer el flujo.',
                'Click a step or use the arrows to walk through the flow.',
                'Clique em um passo ou use as setas para percorrer o fluxo.'),
    search: T('Buscar endpoint, campo o descripción…', 'Search endpoint, field or description…', 'Buscar endpoint, campo ou descrição…'),
    all: T('Todos', 'All', 'Todos'),
    coreOnly: T('Solo núcleo', 'Core only', 'Somente núcleo'),
    integration: T('Integración', 'Integration', 'Integração'),
    integ: {
      std: T('Estándar', 'Standard', 'Padrão'),
      crm: T('CRM', 'CRM', 'CRM'),
      planner: T('Planeador', 'Planner', 'Planejador'),
      extra: T('Adicional', 'Additional', 'Adicional')
    },
    core: T('Núcleo', 'Core', 'Núcleo'),
    optional: T('Según alcance', 'Per scope', 'Conforme escopo'),
    noResults: T('Sin resultados.', 'No results.', 'Nenhum resultado.'),
    results: T('resultados', 'results', 'resultados'),
    progress: T('Progreso', 'Progress', 'Progresso'),
    resetChecklist: T('Reiniciar', 'Reset', 'Reiniciar'),
    checklistNote: T('Tu progreso se guarda solo en este navegador.',
                     'Your progress is saved in this browser only.',
                     'Seu progresso fica salvo somente neste navegador.'),
    dms2cm: T('CM ← DMS', 'CM ← DMS', 'CM ← DMS'),
    cm2dms: T('CM → DMS', 'CM → DMS', 'CM → DMS'),
    dms2cmLong: T('El DMS llama a ClearMechanic', 'The DMS calls ClearMechanic', 'O DMS chama o ClearMechanic'),
    cm2dmsLong: T('ClearMechanic llama al DMS (webhook)', 'ClearMechanic calls the DMS (webhook)', 'O ClearMechanic chama o DMS (webhook)'),
    youImplement: T('Lo implementa el DMS', 'Implemented by the DMS', 'Implementado pelo DMS'),
    youCall: T('Lo consume el DMS', 'Consumed by the DMS', 'Consumido pelo DMS'),
    menu: T('Contenido', 'Contents', 'Conteúdo'),
    loading: T('Cargando…', 'Loading…', 'Carregando…'),
    actors: {
      dms: T('DMS', 'DMS', 'DMS'),
      cm: T('ClearMechanic', 'ClearMechanic', 'ClearMechanic'),
      user: T('Usuario / Asesor CM', 'CM User / Advisor', 'Usuário / Consultor CM')
    },
    groups: {
      auth: T('Autenticación', 'Authentication', 'Autenticação'),
      catalogs: T('Catálogos', 'Catalogs', 'Catálogos'),
      appointments: T('Citas', 'Appointments', 'Agendamentos'),
      orders: T('Órdenes de Reparación', 'Repair Orders', 'Ordens de Serviço'),
      quotes: T('Cotizaciones / Inventario', 'Quotes / Inventory', 'Orçamentos / Estoque'),
      customers: T('Clientes', 'Customers', 'Clientes'),
      vehicles: T('Vehículos', 'Vehicles', 'Veículos'),
      users: T('Usuarios', 'Users', 'Usuários'),
      estimates: T('Estimaciones', 'Estimates', 'Estimativas'),
      planner: T('Planeador de Taller', 'Workshop Planner', 'Planejador da Oficina'),
      tasks: T('Tareas', 'Tasks', 'Tarefas'),
      reports: T('Reportes', 'Reports', 'Relatórios'),
      others: T('Otros', 'Others', 'Outros')
    }
  };
}

/* --------------------------------------------------------------------------
 *  SECCIONES
 *  Tipos de bloque: hero, p, h, list, callout(info|warn|tip), code, endpoints,
 *  fields, sequence, arch, model, steps, tabs, cards, navcards, table,
 *  explorer, checklist, changelog
 * -------------------------------------------------------------------------- */
function getGuideSource_() {
  return {
    meta: {
      version: '2.0',
      updated: '2026-11-10',
      email: LINKS.email,
      links: LINKS,
      changelog: [
        { v: '2.0', date: '2026-11-10',
          t: T('Guía interactiva en línea (ES/EN/PT) que reemplaza a los PDF. Nuevas secciones: integración CRM, Planeador de Taller, identificación multi-agencia (`organizationId` / `workshopId`) y política de reintentos. Correcciones: `PATCH /cm/v2/orders/{orderNumber}`, `PATCH /orders/{orderNumber}`, `POST /appointments` responde `201`. Referencia completa de endpoints con enlace directo a SwaggerHub.',
               'Online interactive guide (ES/EN/PT) replacing the PDFs. New sections: CRM integration, Workshop Planner, multi-dealer identification (`organizationId` / `workshopId`) and retry policy. Fixes: `PATCH /cm/v2/orders/{orderNumber}`, `PATCH /orders/{orderNumber}`, `POST /appointments` returns `201`. Full endpoint reference with direct SwaggerHub links.',
               'Guia interativo online (ES/EN/PT) que substitui os PDFs. Novas seções: integração CRM, Planejador da Oficina, identificação multiconcessionária (`organizationId` / `workshopId`) e política de novas tentativas. Correções: `PATCH /cm/v2/orders/{orderNumber}`, `PATCH /orders/{orderNumber}`, `POST /appointments` retorna `201`. Referência completa de endpoints com link direto ao SwaggerHub.') },
        { v: '1.0', date: '2026',
          t: T('Primera versión en PDF (ES/EN).', 'First PDF version (ES/EN).', 'Primeira versão em PDF (ES/EN).') }
      ]
    },
    ui: getUi_(),
    endpoints: getEndpoints_(),
    sections: [
      /* ================================================================ */
      { id: 'overview', icon: '🏠',
        title: T('Introducción', 'Introduction', 'Introdução'),
        blocks: [
          { type: 'hero',
            title: T('Guía de Integración DMS', 'DMS Integration Guide', 'Guia de Integração DMS'),
            subtitle: T('Todo lo que tu equipo técnico necesita para conectar su DMS con ClearMechanic.',
                        'Everything your technical team needs to connect your DMS with ClearMechanic.',
                        'Tudo o que sua equipe técnica precisa para conectar o DMS ao ClearMechanic.') },
          { type: 'p', text: T(
            'Esta guía describe los flujos técnicos de integración entre un DMS (Dealer Management System) y **ClearMechanic**, la plataforma de gestión de taller recomendada por General Motors para concesionarios en Latinoamérica.',
            'This guide describes the technical integration flows between a DMS (Dealer Management System) and **ClearMechanic**, the Workshop Management platform recommended by General Motors for dealerships across Latin America.',
            'Este guia descreve os fluxos técnicos de integração entre um DMS (Dealer Management System) e o **ClearMechanic**, a plataforma de gestão de oficina recomendada pela General Motors para concessionárias na América Latina.') },
          { type: 'p', text: T(
            'La integración es **bidireccional**: el DMS envía información a ClearMechanic usando la **CM Product API**, y ClearMechanic envía información al DMS mediante **webhooks** que el DMS implementa siguiendo los contratos de la **Guía DMS**.',
            'The integration is **bidirectional**: the DMS sends information to ClearMechanic using the **CM Product API**, and ClearMechanic sends information to the DMS via **webhooks** that the DMS implements following the contracts in the **DMS API Guide**.',
            'A integração é **bidirecional**: o DMS envia informações ao ClearMechanic usando a **CM Product API**, e o ClearMechanic envia informações ao DMS por meio de **webhooks** que o DMS implementa seguindo os contratos do **Guia DMS**.') },
          { type: 'cards', items: [
            { icon: '📘', href: LINKS.productApi,
              title: T('CM Product API', 'CM Product API', 'CM Product API'),
              text: T('Endpoints de ClearMechanic que el DMS consume.', 'ClearMechanic endpoints consumed by the DMS.', 'Endpoints do ClearMechanic consumidos pelo DMS.') },
            { icon: '📗', href: LINKS.dmsApi,
              title: T('Guía DMS (webhooks)', 'DMS API Guide (webhooks)', 'Guia DMS (webhooks)'),
              text: T('Endpoints que el DMS implementa para recibir webhooks.', 'Endpoints the DMS implements to receive webhooks.', 'Endpoints que o DMS implementa para receber webhooks.') },
            { icon: '🧪', href: LINKS.sandbox,
              title: T('API Sandbox', 'API Sandbox', 'API Sandbox'),
              text: T('Ambiente de pruebas para desarrollar la integración.', 'Testing environment to build the integration.', 'Ambiente de testes para desenvolver a integração.') },
            { icon: '✉️', href: 'mailto:' + LINKS.email,
              title: T('Soporte técnico', 'Technical support', 'Suporte técnico'),
              text: T(LINKS.email, LINKS.email, LINKS.email) }
          ] },
          { type: 'h', text: T('Arquitectura general', 'General architecture', 'Arquitetura geral') },
          { type: 'p', text: T(
            'La comunicación sigue un modelo **Hub-and-Spoke** donde ClearMechanic actúa como hub central. Ambas especificaciones están en formato OpenAPI 3.0 en SwaggerHub.',
            'Communication follows a **Hub-and-Spoke** model where ClearMechanic acts as the central hub. Both specifications are available in OpenAPI 3.0 format on SwaggerHub.',
            'A comunicação segue um modelo **Hub-and-Spoke** em que o ClearMechanic atua como hub central. Ambas as especificações estão em formato OpenAPI 3.0 no SwaggerHub.') },
          { type: 'arch',
            dms: T('Sistema DMS', 'DMS System', 'Sistema DMS'),
            dmsSub: T('Software de la agencia', 'Dealership software', 'Software da concessionária'),
            cm: T('ClearMechanic', 'ClearMechanic', 'ClearMechanic'),
            cmSub: T('Gestión de taller', 'Workshop management', 'Gestão de oficina'),
            toCm: T('CM Product API · REST + JWT', 'CM Product API · REST + JWT', 'CM Product API · REST + JWT'),
            toCmSub: T('Crear / actualizar citas, OR…', 'Create / update appointments, ROs…', 'Criar / atualizar agendamentos, OS…'),
            toDms: T('Webhooks · Guía DMS', 'Webhooks · DMS API Guide', 'Webhooks · Guia DMS'),
            toDmsSub: T('Notificar cambios, consultar catálogos…', 'Notify changes, query catalogs…', 'Notificar mudanças, consultar catálogos…') },
          { type: 'h', text: T('Modelo de datos clave', 'Key data model', 'Modelo de dados principal') },
          { type: 'model', items: [
            { icon: '📅', goto: 'appointments',
              title: T('Cita', 'Appointment', 'Agendamento'),
              key: 'appointmentNumber',
              text: T('Evento programado para que el cliente lleve su vehículo al taller.',
                      'Scheduled event for a customer to bring their vehicle to the workshop.',
                      'Evento agendado para o cliente levar o veículo à oficina.') },
            { icon: '🔧', goto: 'orders',
              title: T('Orden de Reparación (OR)', 'Repair Order (RO)', 'Ordem de Serviço (OS)'),
              key: 'orderNumber',
              text: T('Documento de trabajo activo en el taller. Puede originarse de una cita o crearse directamente.',
                      'Active work document in the workshop. May originate from an appointment or be created directly.',
                      'Documento de trabalho ativo na oficina. Pode se originar de um agendamento ou ser criado diretamente.') },
            { icon: '💲', goto: 'quotes',
              title: T('Cotización', 'Quote / Estimate', 'Orçamento'),
              key: 'quoteId',
              text: T('Puntos de inspección con refacciones, mano de obra y precios. Siempre ligada a una OR.',
                      'Inspection points with parts, labor and pricing. Always linked to an RO.',
                      'Pontos de inspeção com peças, mão de obra e preços. Sempre vinculado a uma OS.') }
          ] },
          { type: 'h', text: T('¿Por dónde empiezo?', 'Where do I start?', 'Por onde começo?') },
          { type: 'navcards', items: ['onboarding', 'auth', 'catalogs', 'appointments', 'orders', 'quotes', 'crm', 'planner', 'reference', 'checklist'] }
        ] },

      /* ================================================================ */
      { id: 'onboarding', icon: '🚀',
        title: T('Proceso de integración', 'Onboarding process', 'Processo de integração'),
        summary: T('Pasos y ambientes, desde el primer contacto hasta producción.', 'Steps and environments, from first contact to production.', 'Passos e ambientes, do primeiro contato até a produção.'),
        blocks: [
          { type: 'steps', items: [
            { title: T('Contacto', 'Contact', 'Contato'),
              text: T('Escribe a [' + LINKS.email + '](mailto:' + LINKS.email + ') para iniciar el proceso de integración.',
                      'Email [' + LINKS.email + '](mailto:' + LINKS.email + ') to start the integration process.',
                      'Escreva para [' + LINKS.email + '](mailto:' + LINKS.email + ') para iniciar o processo de integração.') },
            { title: T('Cuenta en Sandbox', 'Sandbox account', 'Conta no Sandbox'),
              text: T('El DMS crea una cuenta y una aplicación en el [API Sandbox](' + LINKS.sandbox + ').',
                      'The DMS creates an account and an application in the [API Sandbox](' + LINKS.sandbox + ').',
                      'O DMS cria uma conta e uma aplicação no [API Sandbox](' + LINKS.sandbox + ').') },
            { title: T('Desarrollo', 'Development', 'Desenvolvimento'),
              text: T('El DMS implementa los flujos usando el ambiente Sandbox.', 'The DMS implements the flows using the Sandbox environment.', 'O DMS implementa os fluxos usando o ambiente Sandbox.') },
            { title: T('Validación', 'Validation', 'Validação'),
              text: T('ClearMechanic realiza la validación técnica de la integración.', 'ClearMechanic performs the technical validation of the integration.', 'O ClearMechanic realiza a validação técnica da integração.') },
            { title: T('Producción', 'Production', 'Produção'),
              text: T('Una vez aprobada, se otorgan las credenciales de Producción.', 'Once approved, Production credentials are granted.', 'Após a aprovação, as credenciais de Produção são concedidas.') }
          ] },
          { type: 'h', text: T('Ambientes disponibles', 'Available environments', 'Ambientes disponíveis') },
          { type: 'table',
            headers: [T('Ambiente', 'Environment', 'Ambiente'), T('Descripción', 'Description', 'Descrição')],
            rows: [
              [T('🧪 **Sandbox**', '🧪 **Sandbox**', '🧪 **Sandbox**'),
               T('[API Sandbox](' + LINKS.sandbox + ') dedicado para pruebas. El desarrollador registra una cuenta y configura una aplicación para generar los identificadores `repairShopId`, `workshopId` y `apiKey`. El usuario y contraseña del registro son las credenciales para obtener el access token.',
                 'Dedicated [API Sandbox](' + LINKS.sandbox + ') for testing. Developers register an account and configure an application to generate the `repairShopId`, `workshopId` and `apiKey` identifiers. The username and password from registration are the credentials used to obtain the access token.',
                 '[API Sandbox](' + LINKS.sandbox + ') dedicado para testes. O desenvolvedor registra uma conta e configura uma aplicação para gerar os identificadores `repairShopId`, `workshopId` e `apiKey`. O usuário e a senha do registro são as credenciais para obter o access token.')],
              [T('🏭 **Producción**', '🏭 **Production**', '🏭 **Produção**'),
               T('Las credenciales de Producción las entrega ClearMechanic de forma segura solo después de validar la funcionalidad y el desempeño de la integración en Sandbox.',
                 'Production credentials are securely provisioned by ClearMechanic only after the integration\'s functionality and performance have been validated in Sandbox.',
                 'As credenciais de Produção são fornecidas com segurança pelo ClearMechanic somente após a validação da funcionalidade e do desempenho da integração no Sandbox.')]
            ] },
          { type: 'callout', variant: 'tip',
            title: T('Antes de comenzar', 'Before you start', 'Antes de começar'),
            items: [
              T('Define con ClearMechanic qué flujos aplican a tu integración (citas, OR, cotizaciones).', 'Agree with ClearMechanic which flows apply to your integration (appointments, ROs, quotes).', 'Defina com o ClearMechanic quais fluxos se aplicam à sua integração (agendamentos, OS, orçamentos).'),
              T('Ten lista la URL base HTTPS donde publicarás los webhooks y el esquema de autenticación que usarás.', 'Have the HTTPS base URL where you will expose webhooks and the authentication scheme you will use.', 'Tenha pronta a URL base HTTPS onde publicará os webhooks e o esquema de autenticação que usará.'),
              T('Usa el [checklist](#checklist) para seguir tu avance.', 'Use the [checklist](#checklist) to track your progress.', 'Use o [checklist](#checklist) para acompanhar seu progresso.')
            ] }
        ] },

      /* ================================================================ */
      { id: 'auth', icon: '🔐',
        title: T('Autenticación', 'Authentication', 'Autenticação'),
        summary: T('JWT para llamar a ClearMechanic y esquemas para recibir webhooks.', 'JWT to call ClearMechanic and schemes to receive webhooks.', 'JWT para chamar o ClearMechanic e esquemas para receber webhooks.'),
        blocks: [
          { type: 'h', text: T('DMS → ClearMechanic (JWT)', 'DMS → ClearMechanic (JWT)', 'DMS → ClearMechanic (JWT)') },
          { type: 'p', text: T(
            'Para consumir cualquier endpoint de la CM Product API, el DMS debe incluir un **JWT Access Token** en el header `Authorization` de cada petición.',
            'To call any CM Product API endpoint, the DMS must include a **JWT Access Token** in the `Authorization` header of every request.',
            'Para consumir qualquer endpoint da CM Product API, o DMS deve incluir um **JWT Access Token** no header `Authorization` de cada requisição.') },
          { type: 'endpoints', ids: ['login'] },
          { type: 'code', title: T('Petición', 'Request', 'Requisição'), code:
            'POST /users/login\nContent-Type: application/json\n\n{\n  "email": "user@dms.com",\n  "password": "password"\n}' },
          { type: 'code', title: T('Respuesta exitosa', 'Successful response', 'Resposta de sucesso'), code:
            '{\n  "email": "user@dms.com",\n  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",\n  "expiresIn": 10800\n}' },
          { type: 'callout', variant: 'warn',
            title: T('Importante — Expiración del token', 'Important — Token expiration', 'Importante — Expiração do token'),
            items: [
              T('El token es válido por **3 horas** (10,800 segundos).', 'The token is valid for **3 hours** (10,800 seconds).', 'O token é válido por **3 horas** (10.800 segundos).'),
              T('El DMS debe implementar renovación automática antes de la expiración.', 'The DMS must implement automatic token refresh before expiration.', 'O DMS deve implementar a renovação automática antes da expiração.'),
              T('Se recomienda renovarlo cuando falten menos de **10 minutos**.', 'It is recommended to renew it when less than **10 minutes** remain.', 'Recomenda-se renová-lo quando faltarem menos de **10 minutos**.'),
              T('Úsalo en el header: `Authorization: Bearer {accessToken}`', 'Use it in the header: `Authorization: Bearer {accessToken}`', 'Use-o no header: `Authorization: Bearer {accessToken}`')
            ] },
          { type: 'h', text: T('ClearMechanic → DMS (Webhooks)', 'ClearMechanic → DMS (Webhooks)', 'ClearMechanic → DMS (Webhooks)') },
          { type: 'p', text: T(
            '**El DMS define su mecanismo de autenticación y ClearMechanic se adapta a él.** Estos son los esquemas más comunes:',
            '**The DMS defines its authentication mechanism and ClearMechanic adapts to it.** These are the most common schemes:',
            '**O DMS define seu mecanismo de autenticação e o ClearMechanic se adapta a ele.** Estes são os esquemas mais comuns:') },
          { type: 'tabs', tabs: [
            { title: T('Bearer Token', 'Bearer Token', 'Bearer Token'), blocks: [
              { type: 'p', text: T('Header `Authorization: Bearer {token}`. El DMS entrega el token a ClearMechanic durante el onboarding.',
                                   'Header `Authorization: Bearer {token}`. The DMS provides the token to ClearMechanic during onboarding.',
                                   'Header `Authorization: Bearer {token}`. O DMS fornece o token ao ClearMechanic durante o onboarding.') },
              { type: 'code', code: 'POST https://{hostname}/api/orders\nAuthorization: Bearer {token}\norganizationId: {organizationId}\nContent-Type: application/json' } ] },
            { title: T('Basic Auth', 'Basic Auth', 'Basic Auth'), blocks: [
              { type: 'p', text: T('Credenciales `usuario:contraseña` codificadas en Base64.',
                                   '`user:password` credentials encoded in Base64.',
                                   'Credenciais `usuario:senha` codificadas em Base64.') },
              { type: 'code', code: 'POST https://{hostname}/api/orders\nAuthorization: Basic {base64(user:password)}\norganizationId: {organizationId}\nContent-Type: application/json' } ] },
            { title: T('OAuth2 Client Credentials', 'OAuth2 Client Credentials', 'OAuth2 Client Credentials'), blocks: [
              { type: 'p', text: T('El DMS entrega un `clientId` y `clientSecret` (y la URL del token). ClearMechanic obtiene el token antes de cada llamada.',
                                   'The DMS provides a `clientId` and `clientSecret` (and the token URL). ClearMechanic obtains the token before each call.',
                                   'O DMS fornece um `clientId` e `clientSecret` (e a URL do token). O ClearMechanic obtém o token antes de cada chamada.') },
              { type: 'code', code: 'POST {tokenUrl}\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=client_credentials&client_id={clientId}&client_secret={clientSecret}\n\n# luego / then / depois:\nPOST https://{hostname}/api/orders\nAuthorization: Bearer {access_token}' } ] }
          ] },
          { type: 'callout', variant: 'info',
            title: T('Configuración requerida del DMS', 'Required DMS configuration', 'Configuração necessária do DMS'),
            items: [
              T('Definir el mecanismo de autenticación durante el onboarding (Bearer, Basic, OAuth2 u otro).', 'Define the authentication mechanism during onboarding (Bearer, Basic, OAuth2 or other).', 'Definir o mecanismo de autenticação durante o onboarding (Bearer, Basic, OAuth2 ou outro).'),
              T('Entregar a ClearMechanic las credenciales del esquema elegido.', 'Provide ClearMechanic with the credentials for the chosen scheme.', 'Fornecer ao ClearMechanic as credenciais do esquema escolhido.'),
              T('La URL base de webhooks debe ser **HTTPS** (formato `https://{hostname}/api`).', 'The webhook base URL must be **HTTPS** (format `https://{hostname}/api`).', 'A URL base dos webhooks deve ser **HTTPS** (formato `https://{hostname}/api`).')
            ] },
          { type: 'h', text: T('Identificación de la agencia (multi-agencia)', 'Dealer identification (multi-dealer)', 'Identificação da concessionária (multiconcessionária)') },
          { type: 'p', text: T(
            'Un mismo DMS suele atender a varias agencias. Para no tener una URL por agencia, cada llamada identifica a la agencia con un parámetro:',
            'A single DMS usually serves several dealers. To avoid one URL per dealer, every call identifies the dealer with a parameter:',
            'Um mesmo DMS costuma atender várias concessionárias. Para não ter uma URL por concessionária, cada chamada identifica a concessionária com um parâmetro:') },
          { type: 'table',
            headers: [T('Dirección', 'Direction', 'Direção'), T('Parámetro', 'Parameter', 'Parâmetro'), T('Descripción', 'Description', 'Descrição')],
            rows: [
              [T('CM ← DMS', 'CM ← DMS', 'CM ← DMS'), T('`workshopId` (query, GUID)', '`workshopId` (query, GUID)', '`workshopId` (query, GUID)'),
               T('Identificador de la agencia en ClearMechanic, entregado por ClearMechanic. Requerido en los endpoints de la CM Product API.', 'Dealer identifier in ClearMechanic, provided by ClearMechanic. Required on CM Product API endpoints.', 'Identificador da concessionária no ClearMechanic, fornecido pelo ClearMechanic. Obrigatório nos endpoints da CM Product API.')],
              [T('CM → DMS', 'CM → DMS', 'CM → DMS'), T('`organizationId` (header)', '`organizationId` (header)', '`organizationId` (header)'),
               T('Identificador de la agencia **en el DMS**. ClearMechanic lo envía en cada webhook: la URL es la misma para todas las agencias y solo cambia el `organizationId`.', 'Dealer identifier **in the DMS**. ClearMechanic sends it on every webhook: the URL is the same for every dealer and only the `organizationId` changes.', 'Identificador da concessionária **no DMS**. O ClearMechanic o envia em cada webhook: a URL é a mesma para todas as concessionárias e só muda o `organizationId`.')]
            ] },
          { type: 'code', title: T('Ejemplo: mismo endpoint, dos agencias', 'Example: same endpoint, two dealers', 'Exemplo: mesmo endpoint, duas concessionárias'), code:
            'POST https://dms.example.com/api/orders\norganizationId: DEALER-001\n\nPOST https://dms.example.com/api/orders\norganizationId: DEALER-002' },
          { type: 'callout', variant: 'tip',
            title: T('Durante el onboarding', 'During onboarding', 'Durante o onboarding'),
            items: [ T('Comparte con ClearMechanic el `organizationId` de cada agencia; ClearMechanic lo relaciona con el `workshopId` correspondiente.', 'Share each dealer\'s `organizationId` with ClearMechanic; ClearMechanic maps it to the matching `workshopId`.', 'Compartilhe com o ClearMechanic o `organizationId` de cada concessionária; o ClearMechanic o relaciona ao `workshopId` correspondente.') ] }
        ] },

      /* ================================================================ */
      { id: 'catalogs', icon: '🗂️',
        title: T('Catálogos y configuración', 'Catalogs and setup', 'Catálogos e configuração'),
        summary: T('Datos maestros que cada lado necesita antes de operar.', 'Master data each side needs before operating.', 'Dados mestres que cada lado precisa antes de operar.'),
        blocks: [
          { type: 'p', text: T(
            'Antes de operar los flujos principales, el DMS debe conocer y/o exponer ciertos catálogos que ClearMechanic usa para mapear entidades. Cada DMS realiza este proceso durante la fase de integración.',
            'Before operating the main flows, the DMS must know and/or expose certain catalogs that ClearMechanic uses to map entities. Each DMS performs this process during the integration phase.',
            'Antes de operar os fluxos principais, o DMS deve conhecer e/ou expor certos catálogos que o ClearMechanic usa para mapear entidades. Cada DMS realiza esse processo durante a fase de integração.') },
          { type: 'h', text: T('Catálogos que el DMS expone (Guía DMS)', 'Catalogs the DMS must expose (DMS API Guide)', 'Catálogos que o DMS expõe (Guia DMS)') },
          { type: 'endpoints', ids: ['vehicles', 'advisors', 'invList', 'invItem'] },
          { type: 'h', text: T('Catálogos de ClearMechanic (CM Product API)', 'ClearMechanic catalogs (CM Product API)', 'Catálogos do ClearMechanic (CM Product API)') },
          { type: 'endpoints', ids: ['cmAdvisors', 'cmUsers', 'cmReasons', 'cmCustomReasons', 'cmPhases'] },
          { type: 'h', text: T('IDs externos (externalId)', 'External IDs (externalId)', 'IDs externos (externalId)') },
          { type: 'p', text: T(
            'Para evitar que el DMS consulte los catálogos de usuarios de ClearMechanic en cada operación, ClearMechanic soporta IDs externos configurados en cada usuario:',
            'To avoid the DMS querying ClearMechanic user catalogs on every operation, ClearMechanic supports external IDs configured on each user:',
            'Para evitar que o DMS consulte os catálogos de usuários do ClearMechanic em cada operação, o ClearMechanic suporta IDs externos configurados em cada usuário:') },
          { type: 'list', items: [
            T('`serviceAdvisorExternalId`: ID del asesor de servicio en el DMS, configurado en el perfil del usuario en ClearMechanic.', '`serviceAdvisorExternalId`: the service advisor\'s ID in the DMS, configured in the user\'s ClearMechanic profile.', '`serviceAdvisorExternalId`: ID do consultor técnico no DMS, configurado no perfil do usuário no ClearMechanic.'),
            T('`userWhoScheduleExternalId`: ID en el DMS del usuario que agenda, configurado en el perfil de ClearMechanic.', '`userWhoScheduleExternalId`: the scheduling user\'s ID in the DMS, configured in the ClearMechanic profile.', '`userWhoScheduleExternalId`: ID no DMS do usuário que agenda, configurado no perfil do ClearMechanic.'),
            T('`technicianExternalId`: ID del técnico en el DMS, configurado en el perfil del técnico en ClearMechanic.', '`technicianExternalId`: the technician\'s ID in the DMS, configured in the technician\'s ClearMechanic profile.', '`technicianExternalId`: ID do técnico no DMS, configurado no perfil do técnico no ClearMechanic.'),
            T('`inCharge` / `assignedTo` en órdenes: aceptan directamente el ID externo del DMS.', '`inCharge` / `assignedTo` in orders: accept the DMS external ID directly.', '`inCharge` / `assignedTo` nas ordens: aceitam diretamente o ID externo do DMS.')
          ] },
          { type: 'callout', variant: 'tip',
            title: T('Recomendación', 'Recommendation', 'Recomendação'),
            items: [
              T('Configura los IDs externos en los usuarios de ClearMechanic durante el onboarding.', 'Configure external IDs on ClearMechanic users during onboarding.', 'Configure os IDs externos nos usuários do ClearMechanic durante o onboarding.'),
              T('Así eliminas llamadas adicionales a `GET /cm/serviceAdvisors` o `GET /cm/users` en cada transacción.', 'This eliminates extra calls to `GET /cm/serviceAdvisors` or `GET /cm/users` on every transaction.', 'Isso elimina chamadas adicionais a `GET /cm/serviceAdvisors` ou `GET /cm/users` em cada transação.')
            ] }
        ] },

      /* ================================================================ */
      { id: 'appointments', icon: '📅',
        title: T('Flujo 1 — Citas', 'Flow 1 — Appointments', 'Fluxo 1 — Agendamentos'),
        summary: T('Crear, actualizar y eliminar citas en ambos sentidos.', 'Create, update and delete appointments in both directions.', 'Criar, atualizar e excluir agendamentos nos dois sentidos.'),
        blocks: [
          { type: 'p', text: T(
            'Las citas son el primer punto de contacto del cliente con el taller. La integración permite crear, actualizar y eliminar citas en ambos sentidos.',
            'Appointments are the customer\'s first point of contact with the workshop. The integration supports creating, updating and deleting appointments in both directions.',
            'Os agendamentos são o primeiro ponto de contato do cliente com a oficina. A integração permite criar, atualizar e excluir agendamentos nos dois sentidos.') },
          { type: 'endpoints', ids: ['cmApptCreate', 'cmApptUpdate', 'cmApptDelete', 'apptCreate', 'apptUpdate', 'apptDelete'] },

          { type: 'h', text: T('El DMS crea una cita en ClearMechanic', 'DMS creates an appointment in ClearMechanic', 'O DMS cria um agendamento no ClearMechanic') },
          { type: 'sequence', participants: ['dms', 'cm'], steps: [
            { from: 'dms', to: 'cm', label: 'POST /users/login',
              note: T('Obtener JWT si no se tiene o está por expirar.', 'Obtain JWT if not available or about to expire.', 'Obter o JWT se não houver ou estiver prestes a expirar.') },
            { from: 'cm', to: 'dms', label: 'accessToken (JWT)', res: true,
              note: T('Token válido por 3 horas.', 'Token valid for 3 hours.', 'Token válido por 3 horas.') },
            { from: 'dms', to: 'cm', label: 'POST /cm/v2/appointments',
              note: T('Body con datos del cliente, vehículo, asesor y motivo de la cita.', 'Body with customer, vehicle, advisor and appointment reason data.', 'Body com dados do cliente, veículo, consultor e motivo do agendamento.') },
            { from: 'cm', to: 'dms', label: '201 Created + appointmentNumber', res: true,
              note: T('ClearMechanic crea el cliente y el vehículo al vuelo si no existen.', 'ClearMechanic creates the customer and vehicle on the fly if they do not exist.', 'O ClearMechanic cria o cliente e o veículo automaticamente se não existirem.') }
          ] },
          { type: 'h3', text: T('Campos principales', 'Main fields', 'Campos principais') },
          { type: 'fields', rows: [
            ['customer.firstName', 'string', 'y', T('Nombre del cliente.', 'Customer\'s first name.', 'Nome do cliente.')],
            ['customer.mobile', 'string', 'y', T('Celular del cliente.', 'Customer\'s mobile phone number.', 'Celular do cliente.')],
            ['vehicle.vin', 'string', 'c', T('VIN del vehículo. Si no se envía, se requieren `licensePlate` + `brand` + `model`.', 'Vehicle VIN. If not sent, `licensePlate` + `brand` + `model` are required.', 'VIN do veículo. Se não for enviado, `licensePlate` + `brand` + `model` são obrigatórios.')],
            ['vehicle.licensePlate / brand / model', 'string', 'c', T('Placa, marca y modelo. Requeridos juntos si no se envía `vin`.', 'Plate, make and model. Required together if `vin` is not sent.', 'Placa, marca e modelo. Obrigatórios juntos se `vin` não for enviado.')],
            ['startDate', 'date-time', 'y', T('Fecha y hora de la cita en UTC (`YYYY-MM-DDTHH:mm:ssZ`).', 'Appointment date and time in UTC (`YYYY-MM-DDTHH:mm:ssZ`).', 'Data e hora do agendamento em UTC (`YYYY-MM-DDTHH:mm:ssZ`).')],
            ['serviceAdvisorId', 'GUID', 'n', T('ID del asesor en ClearMechanic. Si se envía, tiene prioridad sobre `serviceAdvisorExternalId`.', 'Advisor ID in ClearMechanic. If sent, it takes precedence over `serviceAdvisorExternalId`.', 'ID do consultor no ClearMechanic. Se enviado, tem prioridade sobre `serviceAdvisorExternalId`.')],
            ['serviceAdvisorExternalId', 'string', 'n', T('ID externo del asesor (el del DMS, configurado en ClearMechanic). Alternativa a `serviceAdvisorId`.', 'External advisor ID (the DMS one, configured in ClearMechanic). Alternative to `serviceAdvisorId`.', 'ID externo do consultor (o do DMS, configurado no ClearMechanic). Alternativa a `serviceAdvisorId`.')],
            ['userWhoScheduleId', 'GUID', 'n', T('ID del usuario que agenda en ClearMechanic. Tiene prioridad sobre `userWhoScheduleExternalId`.', 'ID of the scheduling user in ClearMechanic. Takes precedence over `userWhoScheduleExternalId`.', 'ID do usuário que agenda no ClearMechanic. Tem prioridade sobre `userWhoScheduleExternalId`.')],
            ['userWhoScheduleExternalId', 'string', 'n', T('ID externo del usuario que agenda. Alternativa a `userWhoScheduleId`.', 'External ID of the scheduling user. Alternative to `userWhoScheduleId`.', 'ID externo do usuário que agenda. Alternativa a `userWhoScheduleId`.')],
            ['technicianId', 'GUID', 'n', T('ID del técnico asignado en ClearMechanic. Tiene prioridad sobre `technicianExternalId`.', 'Assigned technician ID in ClearMechanic. Takes precedence over `technicianExternalId`.', 'ID do técnico atribuído no ClearMechanic. Tem prioridade sobre `technicianExternalId`.')],
            ['technicianExternalId', 'string', 'n', T('ID externo del técnico (el del DMS, configurado en ClearMechanic). Alternativa a `technicianId`.', 'External technician ID (the DMS one, configured in ClearMechanic). Alternative to `technicianId`.', 'ID externo do técnico (o do DMS, configurado no ClearMechanic). Alternativa a `technicianId`.')],
            ['appointmentReasons[]', 'array', 'c', T('Motivos estándar, en **texto**. Usar cuando el dashboard **NO** tiene `customReasons` habilitado.', 'Standard reasons, as **text**. Use when the dashboard does **NOT** have `customReasons` enabled.', 'Motivos padrão, em **texto**. Usar quando o dashboard **NÃO** tem `customReasons` habilitado.')],
            ['customReasons[]', 'array', 'c', T('Motivos personalizados, por **ID**. Usar cuando el dashboard **SÍ** tiene `customReasons` habilitado.', 'Custom reasons, by **ID**. Use when the dashboard **HAS** `customReasons` enabled.', 'Motivos personalizados, por **ID**. Usar quando o dashboard **TEM** `customReasons` habilitado.')]
          ] },
          { type: 'callout', variant: 'info',
            title: T('Disponibilidad de usuarios', 'User availability', 'Disponibilidade de usuários'),
            items: [T('La disponibilidad de los usuarios (asesores, técnicos) para agendar se puede consultar en `GET /cm/scheduleAvailability` antes de crear la cita.',
              'User availability (advisors, technicians) for booking can be checked with `GET /cm/scheduleAvailability` before creating the appointment.',
              'A disponibilidade dos usuários (consultores, técnicos) para agendar pode ser consultada em `GET /cm/scheduleAvailability` antes de criar o agendamento.')] },
          { type: 'details', ep: 'cmApptCreate', title: T('Ver todos los campos de POST /cm/v2/appointments', 'See all POST /cm/v2/appointments fields', 'Ver todos os campos de POST /cm/v2/appointments'), blocks: [
            { type: 'fields', rows: [
              ['appointmentNumber', 'string', 'n', T('Número de cita manual o externo (p. ej. el del DMS).', 'Manual or external appointment number (e.g. the DMS one).', 'Número do agendamento manual ou externo (ex.: o do DMS).')],
              ['customer', 'object', 'y', T('Datos del cliente.', 'Customer data.', 'Dados do cliente.')],
              ['customer.firstName', 'string', 'y', T('Nombre.', 'First name.', 'Nome.')],
              ['customer.lastName', 'string', 'n', T('Apellido.', 'Last name.', 'Sobrenome.')],
              ['customer.mobile', 'string', 'y', T('Celular.', 'Mobile phone.', 'Celular.')],
              ['customer.email', 'string (email)', 'n', T('Correo electrónico.', 'Email.', 'E-mail.')],
              ['vehicle', 'object', 'y', T('Datos del vehículo. `vin` o bien `licensePlate` + `brand` + `model`.', 'Vehicle data. `vin`, or `licensePlate` + `brand` + `model`.', 'Dados do veículo. `vin`, ou `licensePlate` + `brand` + `model`.')],
              ['vehicle.vin', 'string', 'c', T('Número de serie (VIN).', 'Vehicle Identification Number (VIN).', 'Número de chassi (VIN).')],
              ['vehicle.licensePlate', 'string', 'c', T('Placa.', 'License plate.', 'Placa.')],
              ['vehicle.brand', 'string', 'c', T('Marca.', 'Make.', 'Marca.')],
              ['vehicle.model', 'string', 'c', T('Modelo.', 'Model.', 'Modelo.')],
              ['vehicle.year', 'string', 'n', T('Año.', 'Year.', 'Ano.')],
              ['vehicle.color', 'string', 'n', T('Color.', 'Color.', 'Cor.')],
              ['startDate', 'date-time', 'y', T('Fecha y hora de inicio (UTC).', 'Start date and time (UTC).', 'Data e hora de início (UTC).')],
              ['duration', 'integer', 'n', T('Duración estimada en minutos.', 'Estimated duration in minutes.', 'Duração estimada em minutos.')],
              ['deliveryDate', 'date-time', 'n', T('Fecha y hora estimada de entrega.', 'Estimated delivery date and time.', 'Data e hora estimada de entrega.')],
              ['observations', 'string', 'n', T('Comentarios u observaciones de la cita.', 'Appointment comments or observations.', 'Comentários ou observações do agendamento.')],
              ['sendReminder', 'boolean', 'n', T('Envía recordatorio al cliente.', 'Sends a reminder to the customer.', 'Envia lembrete ao cliente.')],
              ['serviceAdvisorId', 'GUID', 'n', T('ID del asesor en ClearMechanic (prioridad sobre el externo).', 'Advisor ID in ClearMechanic (precedence over the external one).', 'ID do consultor no ClearMechanic (prioridade sobre o externo).')],
              ['serviceAdvisorExternalId', 'string', 'n', T('ID externo del asesor.', 'External advisor ID.', 'ID externo do consultor.')],
              ['userWhoScheduleId', 'GUID', 'n', T('ID del usuario que agenda (prioridad sobre el externo).', 'Scheduling user ID (precedence over the external one).', 'ID do usuário que agenda (prioridade sobre o externo).')],
              ['userWhoScheduleExternalId', 'string', 'n', T('ID externo del usuario que agenda.', 'External scheduling user ID.', 'ID externo do usuário que agenda.')],
              ['technicianId', 'GUID', 'n', T('ID del técnico asignado (prioridad sobre el externo).', 'Assigned technician ID (precedence over the external one).', 'ID do técnico atribuído (prioridade sobre o externo).')],
              ['technicianExternalId', 'string', 'n', T('ID externo del técnico asignado.', 'External assigned technician ID.', 'ID externo do técnico atribuído.')],
              ['appointmentOriginId', 'GUID', 'n', T('Origen de la cita (de `GET /cm/v1/appointmentOrigins`).', 'Appointment origin (from `GET /cm/v1/appointmentOrigins`).', 'Origem do agendamento (de `GET /cm/v1/appointmentOrigins`).')],
              ['withValetService', 'boolean', 'n', T('El cliente requiere servicio de valet.', 'The customer requires valet service.', 'O cliente requer serviço de manobrista.')],
              ['mobilityOptionId', 'integer', 'n', T('Opción de movilidad (de `GET /cm/mobilityOptions`).', 'Mobility option (from `GET /cm/mobilityOptions`).', 'Opção de mobilidade (de `GET /cm/mobilityOptions`).')],
              ['appointmentReasons[].appointmentReason', 'string', 'c', T('Texto completo del motivo estándar.', 'Full text of the standard reason.', 'Texto completo do motivo padrão.')],
              ['customReasons[].customReasonId', 'GUID', 'c', T('ID del motivo personalizado (de `GET /cm/customReasons`).', 'Custom reason ID (from `GET /cm/customReasons`).', 'ID do motivo personalizado (de `GET /cm/customReasons`).')],
              ['customReasons[].customReasonExternalId', 'string', 'c', T('ID externo del motivo personalizado configurado en ClearMechanic. Alternativa a `customReasonId`.', 'External ID of the custom reason configured in ClearMechanic. Alternative to `customReasonId`.', 'ID externo do motivo personalizado configurado no ClearMechanic. Alternativa a `customReasonId`.')],
              ['customReasons[].customReasonDetailId', 'string', 'n', T('ID del detalle del motivo (puede ser `null`).', 'Reason detail ID (can be `null`).', 'ID do detalhe do motivo (pode ser `null`).')],
              ['customReasons[].customReasonDetailExternalId', 'string', 'n', T('ID externo del detalle del motivo. Alternativa a `customReasonDetailId`.', 'External ID of the reason detail. Alternative to `customReasonDetailId`.', 'ID externo do detalhe do motivo. Alternativa a `customReasonDetailId`.')]
            ] }
          ] },
          { type: 'callout', variant: 'warn',
            title: T('appointmentReasons vs customReasons', 'appointmentReasons vs customReasons', 'appointmentReasons vs customReasons'),
            items: [
              T('Envía `appointmentReasons` **o** `customReasons`, nunca ambos.', 'Send `appointmentReasons` **or** `customReasons`, never both.', 'Envie `appointmentReasons` **ou** `customReasons`, nunca ambos.'),
              T('Para saber si el dashboard usa motivos personalizados: `GET /cm/customReasons`. Si devuelve datos, usa `customReasons`.', 'To check if the dashboard uses custom reasons: `GET /cm/customReasons`. If it returns data, use `customReasons`.', 'Para saber se o dashboard usa motivos personalizados: `GET /cm/customReasons`. Se retornar dados, use `customReasons`.'),
              T('**appointmentReasons:** no se usan IDs. Envía el **texto completo** del motivo en `appointmentReason` (p. ej. `"Mantenimiento 10,000 km"`).', '**appointmentReasons:** no IDs are used. Send the **full text** of the reason in `appointmentReason` (e.g. `"10,000 km maintenance"`).', '**appointmentReasons:** não se usam IDs. Envie o **texto completo** do motivo em `appointmentReason` (ex.: `"Manutenção 10.000 km"`).'),
              T('**customReasons:** sí se usa el ID: `customReasonId` (de `GET /cm/customReasons`) **o**, en su lugar, el `customReasonExternalId` configurado en ClearMechanic. Lo mismo para el detalle: `customReasonDetailId` o `customReasonDetailExternalId`.', '**customReasons:** the ID is required: `customReasonId` (from `GET /cm/customReasons`) **or**, instead, the `customReasonExternalId` configured in ClearMechanic. Same for the detail: `customReasonDetailId` or `customReasonDetailExternalId`.', '**customReasons:** usa-se o ID: `customReasonId` (de `GET /cm/customReasons`) **ou**, no lugar, o `customReasonExternalId` configurado no ClearMechanic. O mesmo para o detalhe: `customReasonDetailId` ou `customReasonDetailExternalId`.')
            ] },
          { type: 'tabs', tabs: [
            { title: T('Ejemplo — appointmentReasons', 'Example — appointmentReasons', 'Exemplo — appointmentReasons'), blocks: [
              { type: 'code', title: T('Motivos estándar (texto)', 'Standard reasons (text)', 'Motivos padrão (texto)'), code:
                'POST /cm/v2/appointments?workshopId={workshopId}\nAuthorization: Bearer {accessToken}\nContent-Type: application/json\n\n{\n  "customer": {\n    "firstName": "Gabriela",\n    "lastName": "García Garza",\n    "mobile": "5551234567",\n    "email": "gabriela.garcia@example.com"\n  },\n  "vehicle": {\n    "vin": "1G1B790B89VL214",\n    "licensePlate": "PAS1952",\n    "brand": "GMC",\n    "model": "Acadia",\n    "year": "2025"\n  },\n  "startDate": "2026-03-05T10:00:00Z",\n  "duration": 60,\n  "serviceAdvisorExternalId": "Advisor1",\n  "userWhoScheduleExternalId": "User2",\n  "technicianExternalId": "Tech7",\n  "appointmentReasons": [\n    { "appointmentReason": "Sonido raro al acelerar." },\n    { "appointmentReason": "Mantenimiento 10,000 km" }\n  ]\n}' } ] },
            { title: T('Ejemplo — customReasons', 'Example — customReasons', 'Exemplo — customReasons'), blocks: [
              { type: 'p', text: T('El primer motivo usa los IDs de ClearMechanic; el segundo, los IDs externos configurados en ClearMechanic.', 'The first reason uses ClearMechanic IDs; the second, the external IDs configured in ClearMechanic.', 'O primeiro motivo usa os IDs do ClearMechanic; o segundo, os IDs externos configurados no ClearMechanic.') },
              { type: 'code', title: T('Motivos personalizados (ID o ID externo)', 'Custom reasons (ID or external ID)', 'Motivos personalizados (ID ou ID externo)'), code:
                'POST /cm/v2/appointments?workshopId={workshopId}\nAuthorization: Bearer {accessToken}\nContent-Type: application/json\n\n{\n  "customer": {\n    "firstName": "Gabriela",\n    "lastName": "García Garza",\n    "mobile": "5551234567",\n    "email": "gabriela.garcia@example.com"\n  },\n  "vehicle": {\n    "vin": "1G1B790B89VL214",\n    "licensePlate": "PAS1952",\n    "brand": "GMC",\n    "model": "Acadia",\n    "year": "2025"\n  },\n  "startDate": "2026-03-05T10:00:00Z",\n  "duration": 60,\n  "serviceAdvisorExternalId": "Advisor1",\n  "userWhoScheduleExternalId": "User2",\n  "technicianExternalId": "Tech7",\n  "customReasons": [\n    {\n      "customReasonId": "550e8400-e29b-41d4-a716-446655440000",\n      "customReasonDetailId": "660f9511-f30c-52e5-b827-557766551111"\n    },\n    {\n      "customReasonExternalId": "Reason2",\n      "customReasonDetailExternalId": "Detail1"\n    }\n  ]\n}' } ] }
          ] },

          { type: 'h', text: T('ClearMechanic notifica una cita al DMS', 'ClearMechanic notifies an appointment to the DMS', 'O ClearMechanic notifica um agendamento ao DMS') },
          { type: 'sequence', participants: ['user', 'cm', 'dms'], steps: [
            { from: 'user', to: 'cm', labelT: T('Crea/edita la cita en dashboard o app', 'Creates/edits appointment in dashboard or app', 'Cria/edita o agendamento no dashboard ou app'),
              note: T('Acción del asesor o agendador en ClearMechanic.', 'Action by an advisor or scheduler in ClearMechanic.', 'Ação do consultor ou agendador no ClearMechanic.') },
            { from: 'cm', to: 'dms', label: 'POST /appointments',
              note: T('Webhook con los datos completos de la cita. Para cambios: `PATCH /appointments/{appointmentId}`; para eliminación: `DELETE /appointments/{appointmentId}`.', 'Webhook with the complete appointment data. For changes: `PATCH /appointments/{appointmentId}`; for deletion: `DELETE /appointments/{appointmentId}`.', 'Webhook com os dados completos do agendamento. Para alterações: `PATCH /appointments/{appointmentId}`; para exclusão: `DELETE /appointments/{appointmentId}`.') },
            { from: 'dms', to: 'cm', label: '201 Created', res: true,
              note: T('El DMS confirma la recepción del webhook.', 'The DMS confirms webhook receipt.', 'O DMS confirma o recebimento do webhook.') }
          ] },
          { type: 'callout', variant: 'info',
            title: T('Fuente de verdad del número de cita', 'Appointment number source of truth', 'Fonte da verdade do número do agendamento'),
            items: [
              T('El número de cita puede generarse en ClearMechanic y enviarse al DMS: ClearMechanic es la fuente de verdad.', 'The appointment number can be created in ClearMechanic and sent to the DMS: ClearMechanic is the source of truth.', 'O número do agendamento pode ser gerado no ClearMechanic e enviado ao DMS: o ClearMechanic é a fonte da verdade.'),
              T('O ClearMechanic puede enviar el body sin número de cita para que el DMS lo genere y sea la fuente de verdad; ClearMechanic toma el número devuelto por el DMS y crea la cita con él.', 'Or ClearMechanic can send the body without the appointment number so the DMS generates it and is the source of truth; ClearMechanic takes the number returned by the DMS and creates the appointment with it.', 'Ou o ClearMechanic pode enviar o body sem o número para que o DMS o gere e seja a fonte da verdade; o ClearMechanic usa o número retornado pelo DMS para criar o agendamento.')
            ] },
          { type: 'callout', variant: 'info',
            title: T('Respuesta esperada del DMS', 'Expected DMS response', 'Resposta esperada do DMS'),
            items: [
              T('`POST /appointments` → responder **201 Created**. `PATCH` y `DELETE` → responder **200 OK**.', '`POST /appointments` → respond **201 Created**. `PATCH` and `DELETE` → respond **200 OK**.', '`POST /appointments` → responder **201 Created**. `PATCH` e `DELETE` → responder **200 OK**.'),
              T('Si el DMS no responde con éxito, ClearMechanic reintenta el webhook (ver [política de reintentos](#errors)).', 'If the DMS does not respond successfully, ClearMechanic retries the webhook (see [retry policy](#errors)).', 'Se o DMS não responder com sucesso, o ClearMechanic reenvia o webhook (veja a [política de novas tentativas](#errors)).'),
              T('El mismo contrato aplica para `PATCH` (actualización) y `DELETE` (eliminación).', 'The same contract applies to `PATCH` (update) and `DELETE` (deletion).', 'O mesmo contrato se aplica a `PATCH` (atualização) e `DELETE` (exclusão).')
            ] },

          { type: 'h', text: T('Eliminación de citas', 'Appointment deletion', 'Exclusão de agendamentos') },
          { type: 'p', text: T('La eliminación es bidireccional:', 'Deletion is bidirectional:', 'A exclusão é bidirecional:') },
          { type: 'list', items: [
            T('Si se elimina en el DMS: el DMS llama `DELETE /cm/appointments/{appointmentNumber}` en la CM Product API.', 'If deleted in the DMS: the DMS calls `DELETE /cm/appointments/{appointmentNumber}` on the CM Product API.', 'Se excluído no DMS: o DMS chama `DELETE /cm/appointments/{appointmentNumber}` na CM Product API.'),
            T('Si se elimina en ClearMechanic: CM envía el webhook `DELETE /appointments/{appointmentId}` al DMS.', 'If deleted in ClearMechanic: CM sends the `DELETE /appointments/{appointmentId}` webhook to the DMS.', 'Se excluído no ClearMechanic: o CM envia o webhook `DELETE /appointments/{appointmentId}` ao DMS.')
          ] }
        ] },

      /* ================================================================ */
      { id: 'orders', icon: '🔧',
        title: T('Flujo 2 — Órdenes de Reparación', 'Flow 2 — Repair Orders', 'Fluxo 2 — Ordens de Serviço'),
        summary: T('Creación desde el DMS o desde la app, actualización y cierre.', 'Creation from the DMS or the app, update and closure.', 'Criação pelo DMS ou pelo app, atualização e fechamento.'),
        blocks: [
          { type: 'p', text: T(
            'Las Órdenes de Reparación (OR) son el documento operativo central del taller. Pueden originarse de una cita previa o crearse directamente.',
            'Repair Orders (ROs) are the central operational document in the workshop. They can originate from a prior appointment or be created directly.',
            'As Ordens de Serviço (OS) são o documento operacional central da oficina. Podem se originar de um agendamento prévio ou ser criadas diretamente.') },
          { type: 'callout', variant: 'info',
            title: T('orderNumber', 'orderNumber', 'orderNumber'),
            items: [ T('El `orderNumber` **siempre lo genera el DMS** y es el identificador principal en toda la integración.', 'The `orderNumber` is **always generated by the DMS** and is the primary identifier throughout the integration.', 'O `orderNumber` é **sempre gerado pelo DMS** e é o identificador principal em toda a integração.') ] },
          { type: 'endpoints', ids: ['cmPhases', 'cmOrderCreate', 'cmOrderUpdate', 'cmOrderClose', 'vehicles', 'orderCreate', 'orderUpdate', 'orderClose'] },

          { type: 'h', text: T('Flujo A: el DMS crea una OR en ClearMechanic', 'Flow A: DMS creates an RO in ClearMechanic', 'Fluxo A: o DMS cria uma OS no ClearMechanic') },
          { type: 'p', text: T('Cuando se crea una OR en el DMS (desde una cita o directamente), el DMS notifica a ClearMechanic.', 'When an RO is created in the DMS (from an appointment or directly), the DMS notifies ClearMechanic.', 'Quando uma OS é criada no DMS (a partir de um agendamento ou diretamente), o DMS notifica o ClearMechanic.') },
          { type: 'sequence', participants: ['dms', 'cm'], steps: [
            { from: 'dms', to: 'cm', label: 'POST /users/login', note: T('Obtener/renovar JWT.', 'Obtain/renew JWT.', 'Obter/renovar o JWT.') },
            { from: 'dms', to: 'cm', label: 'GET /cm/phases', note: T('Consulta las fases y sus IDs (opcional).', 'Queries phases and their IDs (optional).', 'Consulta as fases e seus IDs (opcional).') },
            { from: 'dms', to: 'cm', label: 'POST /cm/v2/orders', note: T('Body con cliente, vehículo, datos de la OR y opcionalmente puntos de inspección.', 'Body with customer, vehicle, RO data and optionally inspection items.', 'Body com cliente, veículo, dados da OS e opcionalmente pontos de inspeção.') },
            { from: 'cm', to: 'dms', label: '201 Created', res: true, note: T('ClearMechanic crea la OR y devuelve sus datos.', 'ClearMechanic creates the RO and returns its data.', 'O ClearMechanic cria a OS e retorna seus dados.') }
          ] },
          { type: 'h3', text: T('Campos clave de POST /cm/v2/orders', 'Key fields for POST /cm/v2/orders', 'Campos principais de POST /cm/v2/orders') },
          { type: 'fields', rows: [
            ['orderNumber', 'string', 'y', T('Número de OR generado por el DMS. Identificador principal.', 'RO number generated by the DMS. Primary identifier.', 'Número da OS gerado pelo DMS. Identificador principal.')],
            ['appointmentNumber', 'string', 'n', T('Número de cita si la OR proviene de una cita previa.', 'Appointment number if the RO originates from a prior appointment.', 'Número do agendamento se a OS vier de um agendamento prévio.')],
            ['firstName / lastName', 'string', 'n', T('Datos del cliente.', 'Customer data.', 'Dados do cliente.')],
            ['vin', 'string', 'n', T('VIN del vehículo.', 'Vehicle VIN.', 'VIN do veículo.')],
            ['licensePlate', 'string', 'n', T('Placa del vehículo.', 'Vehicle license plate.', 'Placa do veículo.')],
            ['brand / model / year', 'string', 'n', T('Marca, modelo y año.', 'Make, model and year.', 'Marca, modelo e ano.')],
            ['kilometers', 'number', 'n', T('Kilometraje a la recepción.', 'Mileage at check-in.', 'Quilometragem na recepção.')],
            ['phase', 'integer', 'n', T('ID de fase (de `GET /cm/phases`).', 'Phase ID (from `GET /cm/phases`).', 'ID da fase (de `GET /cm/phases`).')],
            ['inCharge', 'string', 'n', T('ID externo (DMS) del responsable de la OR.', 'DMS external ID of the user in charge of the RO.', 'ID externo (DMS) do responsável pela OS.')],
            ['assignedTo', 'string', 'n', T('ID externo (DMS) del usuario asignado.', 'DMS external ID of the assigned user.', 'ID externo (DMS) do usuário atribuído.')],
            ['promisedDate', 'date-time', 'n', T('Fecha promesa de entrega.', 'Promised delivery date.', 'Data prometida de entrega.')],
            ['inspectionItems[]', 'array', 'n', T('Puntos de inspección con cotización precargada (ver abajo).', 'Inspection items with a preloaded quote (see below).', 'Pontos de inspeção com orçamento pré-carregado (veja abaixo).')]
          ] },

          { type: 'h', text: T('Flujo B: ClearMechanic crea una OR (app móvil)', 'Flow B: ClearMechanic creates an RO (mobile app)', 'Fluxo B: o ClearMechanic cria uma OS (app móvel)') },
          { type: 'p', text: T('Cuando un asesor recibe un vehículo sin cita previa y crea la OR desde la app móvil de ClearMechanic:', 'When an advisor receives a vehicle without a prior appointment and creates the RO from the ClearMechanic mobile app:', 'Quando um consultor recebe um veículo sem agendamento prévio e cria a OS pelo app móvel do ClearMechanic:') },
          { type: 'sequence', participants: ['user', 'cm', 'dms'], steps: [
            { from: 'user', to: 'cm', labelT: T('Escanea VIN o placa en la app', 'Scans VIN or plate in the app', 'Escaneia VIN ou placa no app'), note: T('Acción en la app de ClearMechanic.', 'Action in the ClearMechanic app.', 'Ação no app do ClearMechanic.') },
            { from: 'cm', to: 'dms', label: 'GET /vehicles?vin={vin}', note: T('CM consulta al DMS los datos de cliente y vehículo (también `?licensePlate=`).', 'CM queries the DMS for customer and vehicle data (also `?licensePlate=`).', 'O CM consulta o DMS pelos dados do cliente e do veículo (também `?licensePlate=`).') },
            { from: 'dms', to: 'cm', label: '200 + vehicle & customer', res: true, note: T('El DMS devuelve la información registrada del vehículo y su cliente.', 'The DMS returns the registered vehicle and customer information.', 'O DMS retorna as informações cadastradas do veículo e do cliente.') },
            { from: 'user', to: 'cm', labelT: T('Confirma la creación de la OR', 'Confirms RO creation', 'Confirma a criação da OS'), note: T('El asesor revisa y confirma los datos.', 'The advisor reviews and confirms the data.', 'O consultor revisa e confirma os dados.') },
            { from: 'cm', to: 'dms', label: 'POST /orders', note: T('CM notifica al DMS la creación de la OR con todos los datos.', 'CM notifies the DMS of the RO creation with all data.', 'O CM notifica o DMS da criação da OS com todos os dados.') },
            { from: 'dms', to: 'cm', label: '200 OK + orderNumber', res: true, note: T('El DMS confirma y devuelve el `orderNumber` generado.', 'The DMS confirms and returns the generated `orderNumber`.', 'O DMS confirma e retorna o `orderNumber` gerado.') }
          ] },
          { type: 'callout', variant: 'warn',
            title: T('Importante — GET /vehicles', 'Important — GET /vehicles', 'Importante — GET /vehicles'),
            items: [
              T('Este endpoint es crítico para crear OR desde la app móvil.', 'This endpoint is critical for RO creation from the mobile app.', 'Este endpoint é crítico para criar OS pelo app móvel.'),
              T('Debe soportar búsqueda por `vin` (`?vin=`) **y** por `licensePlate` (`?licensePlate=`).', 'It must support search by `vin` (`?vin=`) **and** by `licensePlate` (`?licensePlate=`).', 'Deve suportar busca por `vin` (`?vin=`) **e** por `licensePlate` (`?licensePlate=`).'),
              T('La respuesta debe incluir los datos del cliente asociado (nombre, teléfono, email).', 'The response must include the associated customer data (name, phone, email).', 'A resposta deve incluir os dados do cliente associado (nome, telefone, e-mail).'),
              T('Sin este endpoint el asesor no puede recuperar datos del cliente al escanear placa o VIN.', 'Without it, the advisor cannot retrieve customer data when scanning a plate or VIN.', 'Sem ele, o consultor não consegue recuperar os dados do cliente ao escanear placa ou VIN.')
            ] },
          { type: 'callout', variant: 'info',
            title: T('Campos personalizables (customizableFields)', 'Customizable fields (customizableFields)', 'Campos personalizáveis (customizableFields)'),
            items: [
              T('Para cubrir requisitos específicos de cada integración, la API acepta datos dinámicos en el nodo `customizableFields`: metadatos o información adicional del DMS fuera del esquema base de ClearMechanic, sin perder contexto operativo de la agencia. [Ver en la especificación](' + LINKS.dmsApi + '#/Orders/createOrder).',
                'To cover each integration\'s specific requirements, the API accepts dynamic data in the `customizableFields` node: metadata or additional DMS information outside the core ClearMechanic schema, with no loss of the dealership\'s operational context. [See in the specification](' + LINKS.dmsApi + '#/Orders/createOrder).',
                'Para atender requisitos específicos de cada integração, a API aceita dados dinâmicos no nó `customizableFields`: metadados ou informações adicionais do DMS fora do esquema base do ClearMechanic, sem perda de contexto operacional da concessionária. [Ver na especificação](' + LINKS.dmsApi + '#/Orders/createOrder).')
            ] },

          { type: 'h', text: T('OR con cotización precargada (inspectionItems)', 'RO with preloaded quote (inspectionItems)', 'OS com orçamento pré-carregado (inspectionItems)') },
          { type: 'p', text: T('Si el DMS ya tiene una cotización al crear la OR (p. ej. un mantenimiento preventivo), puede incluirla en el body de `POST /cm/v2/orders` con el campo `inspectionItems`.',
                               'If the DMS already has a quote when creating the RO (e.g. scheduled preventive maintenance), it can include it in the `POST /cm/v2/orders` body using the `inspectionItems` field.',
                               'Se o DMS já tiver um orçamento ao criar a OS (ex.: manutenção preventiva), pode incluí-lo no body de `POST /cm/v2/orders` com o campo `inspectionItems`.') },
          { type: 'code', title: T('Ejemplo parcial', 'Partial example', 'Exemplo parcial'), code:
            '{\n  "orderNumber": "DMS-2026-00123",\n  "firstName": "Carlos",\n  "lastName": "Lopez",\n  "vin": "3VWFE21C04M000001",\n  "inspectionItems": [\n    {\n      "inspectionItemName": "5W30 Oil Change",\n      "externalInspectionItemId": "ITM-4421",\n      "approvalStatus": "Pending",\n      "parts": [\n        { "partName": "5W30 Oil 1L", "partId": "P001", "quantity": 4, "partUnitPrice": 95 }\n      ],\n      "labors": [\n        { "laborName": "Oil change labor", "laborId": "L001", "laborHours": 0.5, "laborHourPrice": 300 }\n      ]\n    }\n  ]\n}' },

          { type: 'h', text: T('Actualización y cierre de la OR', 'RO update and closure', 'Atualização e fechamento da OS') },
          { type: 'sequence', participants: ['dms', 'cm'], steps: [
            { from: 'dms', to: 'cm', label: 'PATCH /cm/v2/orders/{orderNumber}', note: T('El DMS notifica cambios en la OR (kilometraje, asesor, fase, etc.).', 'The DMS notifies RO changes (mileage, advisor, phase, etc.).', 'O DMS notifica alterações na OS (quilometragem, consultor, fase etc.).') },
            { from: 'cm', to: 'dms', label: 'PATCH /orders/{orderNumber}', note: T('CM notifica cambios hechos a la OR desde el dashboard o la app.', 'CM notifies changes made to the RO from the dashboard or app.', 'O CM notifica alterações feitas na OS pelo dashboard ou app.') },
            { from: 'dms', to: 'cm', label: 'PUT /cm/orders/{orderNumber}/close', note: T('El DMS cierra la OR en CM (p. ej. al facturar).', 'The DMS closes the RO in CM (e.g. upon invoicing).', 'O DMS fecha a OS no CM (ex.: ao faturar).') },
            { from: 'cm', to: 'dms', label: 'PUT /orders/{orderNumber}/closeOrder', note: T('CM notifica al DMS que la OR se cerró desde CM.', 'CM notifies the DMS that the RO was closed from CM.', 'O CM notifica o DMS de que a OS foi fechada pelo CM.') }
          ] },
          { type: 'callout', variant: 'info',
            title: T('Cancelación de OR', 'RO cancellation', 'Cancelamento de OS'),
            items: [
              T('No existe un flujo de cancelación separado.', 'There is no separate cancellation flow.', 'Não existe um fluxo de cancelamento separado.'),
              T('El único flujo de finalización es el cierre (`close` / `closeOrder`).', 'The only finalization flow is closure (`close` / `closeOrder`).', 'O único fluxo de finalização é o fechamento (`close` / `closeOrder`).'),
              T('Si una OR debe anularse, se cierra y se documenta la situación en los comentarios.', 'If an RO must be voided, close it and document the situation in the comments.', 'Se uma OS precisar ser anulada, feche-a e documente a situação nos comentários.')
            ] }
        ] },

      /* ================================================================ */
      { id: 'quotes', icon: '💲',
        title: T('Flujo 3 — Cotizaciones', 'Flow 3 — Quotes', 'Fluxo 3 — Orçamentos'),
        summary: T('El asesor cotiza en ClearMechanic con el inventario del DMS.', 'The advisor quotes in ClearMechanic using DMS inventory.', 'O consultor orça no ClearMechanic usando o estoque do DMS.'),
        blocks: [
          { type: 'p', text: T(
            'La cotización siempre la realiza el asesor de servicio en ClearMechanic. El DMS actúa como **proveedor de inventario** y **receptor final** de la cotización. Las cotizaciones siempre están ligadas a una OR existente.',
            'Quoting is always performed by the service advisor in ClearMechanic. The DMS acts as **inventory provider** and **final quote recipient**. Quotes are always linked to an existing RO.',
            'O orçamento é sempre feito pelo consultor técnico no ClearMechanic. O DMS atua como **fornecedor de estoque** e **receptor final** do orçamento. Os orçamentos estão sempre vinculados a uma OS existente.') },
          { type: 'endpoints', ids: ['invList', 'invItem', 'quotes'] },
          { type: 'p', text: T(
            'El asesor puede agregar artículos a la cotización de **dos formas**: buscando por palabra clave (`GET /inventoryItems`) o, si ya conoce el ID de la refacción o mano de obra, agregándolo directamente (`GET /inventoryItems/{itemId}`). En ambos casos, al finalizar, ClearMechanic envía la cotización con `POST /quotes`.',
            'The advisor can add items to the quote in **two ways**: searching by keyword (`GET /inventoryItems`) or, if they already know the part or labor ID, adding it directly (`GET /inventoryItems/{itemId}`). Either way, once finished, ClearMechanic sends the quote with `POST /quotes`.',
            'O consultor pode adicionar itens ao orçamento de **duas formas**: buscando por palavra-chave (`GET /inventoryItems`) ou, se já conhecer o ID da peça ou mão de obra, adicionando-o diretamente (`GET /inventoryItems/{itemId}`). Em ambos os casos, ao finalizar, o ClearMechanic envia o orçamento com `POST /quotes`.') },
          { type: 'h', text: T('Opción A: búsqueda por palabra clave', 'Option A: keyword search', 'Opção A: busca por palavra-chave') },
          { type: 'sequence', participants: ['user', 'cm', 'dms'], steps: [
            { from: 'user', to: 'cm', labelT: T('Busca por palabra en la cotización', 'Searches by keyword in the quote', 'Busca por palavra no orçamento'), note: T('El asesor escribe una palabra clave (p. ej. "frenos") en un punto de inspección de la OR.', 'The advisor types a keyword (e.g. "brakes") on an RO inspection point.', 'O consultor digita uma palavra-chave (ex.: "freios") em um ponto de inspeção da OS.') },
            { from: 'cm', to: 'dms', label: 'GET /inventoryItems?keyword=…', note: T('CM busca en el inventario del DMS con la palabra clave y los datos del vehículo. Ej.: `GET /inventoryItems?keyword=brakes&make=Toyota&model=Corolla&year=2022`', 'CM searches DMS inventory with the keyword and vehicle data. E.g. `GET /inventoryItems?keyword=brakes&make=Toyota&model=Corolla&year=2022`', 'O CM busca no estoque do DMS com a palavra-chave e os dados do veículo. Ex.: `GET /inventoryItems?keyword=brakes&make=Toyota&model=Corolla&year=2022`') },
            { from: 'dms', to: 'cm', label: '200 { jobs, parts, labors }', res: true, note: T('El DMS responde con el listado de `parts`, `labors` y `jobs`, **todos con el detalle necesario para la cotización** (precio, cantidad, horas, disponibilidad). No se hace otra llamada por cada artículo.', 'The DMS responds with the list of `parts`, `labors` and `jobs`, **all with the detail needed for the quote** (price, quantity, hours, availability). No extra call is made per item.', 'O DMS responde com a lista de `parts`, `labors` e `jobs`, **todos com o detalhe necessário para o orçamento** (preço, quantidade, horas, disponibilidade). Não é feita outra chamada por item.') },
            { from: 'user', to: 'cm', labelT: T('Selecciona y agrega los artículos', 'Selects and adds the items', 'Seleciona e adiciona os itens'), note: T('El asesor elige los que necesita y se agregan a la cotización con la información recibida.', 'The advisor picks the ones needed and they are added to the quote with the received information.', 'O consultor escolhe os que precisa e eles são adicionados ao orçamento com as informações recebidas.') },
            { from: 'user', to: 'cm', labelT: T('Finaliza la cotización', 'Finalizes the quote', 'Finaliza o orçamento'), note: T('El asesor revisa y confirma la cotización.', 'The advisor reviews and confirms the quote.', 'O consultor revisa e confirma o orçamento.') },
            { from: 'cm', to: 'dms', label: 'POST /quotes', note: T('CM envía la cotización completa al DMS.', 'CM sends the complete quote to the DMS.', 'O CM envia o orçamento completo ao DMS.') },
            { from: 'dms', to: 'cm', label: '201 Created + quoteId', res: true, note: T('El DMS confirma y devuelve su ID interno de cotización.', 'The DMS confirms and returns its internal quote ID.', 'O DMS confirma e retorna seu ID interno do orçamento.') }
          ] },
          { type: 'h', text: T('Opción B: agregar por ID', 'Option B: add by ID', 'Opção B: adicionar por ID') },
          { type: 'p', text: T('Cuando el asesor ya conoce el ID de la refacción o mano de obra, lo captura directamente en la cotización, sin realizar la búsqueda por palabra.', 'When the advisor already knows the part or labor ID, they enter it directly in the quote, without a keyword search.', 'Quando o consultor já conhece o ID da peça ou mão de obra, ele o informa diretamente no orçamento, sem fazer a busca por palavra.') },
          { type: 'sequence', participants: ['user', 'cm', 'dms'], steps: [
            { from: 'user', to: 'cm', labelT: T('Captura el ID de parte / mano de obra', 'Enters the part / labor ID', 'Informa o ID da peça / mão de obra'), note: T('Por ejemplo `P-001` o `L-002`.', 'For example `P-001` or `L-002`.', 'Por exemplo `P-001` ou `L-002`.') },
            { from: 'cm', to: 'dms', label: 'GET /inventoryItems/{itemId}', note: T('CM solicita solo la información de ese artículo.', 'CM requests only that item\'s information.', 'O CM solicita apenas as informações desse item.') },
            { from: 'dms', to: 'cm', label: '200 + item', res: true, note: T('El DMS devuelve la refacción o mano de obra con su precio y disponibilidad; se agrega directamente a la cotización.', 'The DMS returns the part or labor with its price and availability; it is added directly to the quote.', 'O DMS retorna a peça ou mão de obra com preço e disponibilidade; ela é adicionada diretamente ao orçamento.') }
          ] },
          { type: 'callout', variant: 'info',
            title: T('Después de agregar los artículos', 'After adding the items', 'Depois de adicionar os itens'),
            items: [ T('Con cualquiera de las dos opciones, la cotización se envía al DMS con `POST /quotes` cuando el asesor la finaliza (pasos 5 a 7 de la opción A).', 'With either option, the quote is sent to the DMS with `POST /quotes` when the advisor finalizes it (steps 5 to 7 of option A).', 'Com qualquer uma das opções, o orçamento é enviado ao DMS com `POST /quotes` quando o consultor o finaliza (passos 5 a 7 da opção A).') ] },
          { type: 'h', text: T('Respuesta de GET /inventoryItems', 'GET /inventoryItems response', 'Resposta de GET /inventoryItems') },
          { type: 'p', text: T('El endpoint debe devolver tres categorías: `jobs`, `parts` y `labors`, cada artículo con el detalle completo para la cotización (precio, cantidad u horas, disponibilidad). Filtros: `keyword` (requerido), `make`, `model`, `year`, `orderNumber`.',
                               'The endpoint must return three categories: `jobs`, `parts` and `labors`, each item with the full detail for the quote (price, quantity or hours, availability). Filters: `keyword` (required), `make`, `model`, `year`, `orderNumber`.',
                               'O endpoint deve retornar três categorias: `jobs`, `parts` e `labors`, cada item com o detalhe completo para o orçamento (preço, quantidade ou horas, disponibilidade). Filtros: `keyword` (obrigatório), `make`, `model`, `year`, `orderNumber`.') },
          { type: 'code', code:
            '{\n  "success": true,\n  "message": null,\n  "data": {\n    "jobs": [\n      {\n        "jobName": "Front Brake Change",\n        "jobId": "J-001",\n        "parts": [ { "partName": "Front Brake Pad", "partId": "P-001", "quantity": 2, "partUnitPrice": 850, "availability": 10, "discount": 50 } ],\n        "labors": [ { "laborName": "Brake Labor", "laborId": "L-001", "laborHours": 1.5, "laborHourPrice": 400, "discount": null } ]\n      }\n    ],\n    "parts": [\n      { "partName": "Front Brake Pad", "partId": "P-001", "quantity": 2, "partUnitPrice": 850, "availability": 10, "discount": 50 }\n    ],\n    "labors": [\n      { "laborName": "General Diagnostic", "laborId": "L-002", "laborHours": 1, "laborHourPrice": 350, "discount": 10 }\n    ]\n  }\n}' },
          { type: 'callout', variant: 'info',
            title: T('Campo discount', 'discount field', 'Campo discount'),
            items: [
              T('Cada refacción (`parts`) y mano de obra (`labors`) puede incluir `discount`. Envía `null` si el artículo no tiene descuento.', 'Each part (`parts`) and labor (`labors`) can include `discount`. Send `null` if the item has no discount.', 'Cada peça (`parts`) e mão de obra (`labors`) pode incluir `discount`. Envie `null` se o item não tiver desconto.'),
              T('El descuento puede ser una **cantidad monetaria** o un **porcentaje**, dependiendo de la configuración que se tenga en ClearMechanic. Confirma con ClearMechanic cuál aplica a tu integración.', 'The discount can be a **monetary amount** or a **percentage**, depending on the ClearMechanic configuration. Confirm with ClearMechanic which one applies to your integration.', 'O desconto pode ser um **valor monetário** ou uma **porcentagem**, dependendo da configuração no ClearMechanic. Confirme com o ClearMechanic qual se aplica à sua integração.')
            ] },
          { type: 'h', text: T('Estructura de POST /quotes', 'POST /quotes structure', 'Estrutura de POST /quotes') },
          { type: 'p', text: T('Cuando el asesor finaliza la cotización, ClearMechanic envía al DMS el resumen completo:', 'Once the advisor finalizes the quote, ClearMechanic sends the DMS the complete summary:', 'Quando o consultor finaliza o orçamento, o ClearMechanic envia ao DMS o resumo completo:') },
          { type: 'fields', rows: [
            ['orderNumber', 'string', 'y', T('Número de OR a la que corresponde la cotización.', 'RO number the quote belongs to.', 'Número da OS à qual o orçamento pertence.')],
            ['customerId', 'string', 'n', T('ID del cliente en ClearMechanic.', 'Customer ID in ClearMechanic.', 'ID do cliente no ClearMechanic.')],
            ['items[]', 'array', 'y', T('Artículos cotizados con precio, cantidad y estatus (Approved / Pending / Declined).', 'Quoted items with price, quantity and status (Approved / Pending / Declined).', 'Itens orçados com preço, quantidade e status (Approved / Pending / Declined).')],
            ['subtotal', 'number', 'n', T('Subtotal antes de impuestos.', 'Subtotal before taxes.', 'Subtotal antes dos impostos.')],
            ['taxes', 'number', 'n', T('Monto de impuestos.', 'Tax amount.', 'Valor dos impostos.')],
            ['totalEstimated', 'number', 'n', T('Total estimado.', 'Total estimated amount.', 'Total estimado.')],
            ['approved', 'number', 'n', T('Monto de artículos aprobados.', 'Amount of approved items.', 'Valor dos itens aprovados.')],
            ['declined', 'number', 'n', T('Monto de artículos rechazados.', 'Amount of declined items.', 'Valor dos itens recusados.')],
            ['pending', 'number', 'n', T('Monto de artículos pendientes.', 'Amount of pending items.', 'Valor dos itens pendentes.')],
            ['vin / licensePlates', 'string', 'n', T('Identificadores del vehículo para referencia.', 'Vehicle identifiers for reference.', 'Identificadores do veículo para referência.')]
          ] },
          { type: 'callout', variant: 'info',
            title: T('Reglas de negocio — Cotizaciones', 'Business rules — Quotes', 'Regras de negócio — Orçamentos'),
            items: [
              T('La cotización siempre se hace en ClearMechanic. El DMS no modifica cotizaciones ya enviadas.', 'Quoting is always done in ClearMechanic. The DMS does not modify quotes already sent.', 'O orçamento é sempre feito no ClearMechanic. O DMS não altera orçamentos já enviados.'),
              T('Si el asesor modifica la cotización, se envía un nuevo `POST /quotes` con los datos actualizados.', 'If the advisor modifies the quote, a new `POST /quotes` is sent with the updated data.', 'Se o consultor alterar o orçamento, um novo `POST /quotes` é enviado com os dados atualizados.'),
              T('El DMS usa el `orderNumber` para relacionar la cotización con la OR.', 'The DMS uses the `orderNumber` to relate the quote to the RO.', 'O DMS usa o `orderNumber` para relacionar o orçamento à OS.'),
              T('El estatus de cada artículo viene en `items[].satus` (así, tal cual en la especificación): Approved, Pending o Declined.', 'Each item\'s status comes in `items[].satus` (sic, as in the spec): Approved, Pending or Declined.', 'O status de cada item vem em `items[].satus` (sic, como na especificação): Approved, Pending ou Declined.')
            ] },
          { type: 'callout', variant: 'tip',
            title: T('Variante opcional agrupada por puntos de inspección', 'Optional variant grouped by inspection points', 'Variante opcional agrupada por pontos de inspeção'),
            items: [ T('`POST /quotes` es el formato **estándar**. Solo si tu DMS necesita la cotización agrupada por punto de inspección, puede acordarse `POST /inspectionItemsQuotes`.',
                       '`POST /quotes` is the **standard** format. Only if your DMS needs the quote grouped by inspection point can `POST /inspectionItemsQuotes` be agreed.',
                       '`POST /quotes` é o formato **padrão**. Somente se o seu DMS precisar do orçamento agrupado por ponto de inspeção, pode ser acordado `POST /inspectionItemsQuotes`.') ] },
          { type: 'endpoints', ids: ['inspQuotes'] }
        ] },

      /* ================================================================ */
      { id: 'crm', icon: '👥',
        title: T('Integración CRM', 'CRM integration', 'Integração CRM'),
        summary: T('Clientes, vehículos y tareas sincronizados entre el DMS y ClearMechanic.', 'Customers, vehicles and tasks synchronized between the DMS and ClearMechanic.', 'Clientes, veículos e tarefas sincronizados entre o DMS e o ClearMechanic.'),
        blocks: [
          { type: 'p', text: T(
            'Integración **opcional e independiente** de la estándar. Mantiene sincronizados los clientes, sus vehículos y las tareas de seguimiento en ambos sentidos. Clientes, vehículos y tareas normalmente se implementan juntos.',
            'An **optional, independent** integration on top of the standard one. It keeps customers, their vehicles and follow-up tasks in sync in both directions. Customers, vehicles and tasks are usually implemented together.',
            'Integração **opcional e independente** da padrão. Mantém sincronizados os clientes, seus veículos e as tarefas de acompanhamento nos dois sentidos. Clientes, veículos e tarefas normalmente são implementados juntos.') },
          { type: 'callout', variant: 'info',
            title: T('¿Cómo se habilita?', 'How is it enabled?', 'Como é habilitada?'),
            items: [ T('Acuerda el alcance con ClearMechanic en [' + LINKS.email + '](mailto:' + LINKS.email + ') antes de implementar. Aplican la misma [autenticación](#auth) y los mismos parámetros `workshopId` / `organizationId`.', 'Agree on the scope with ClearMechanic at [' + LINKS.email + '](mailto:' + LINKS.email + ') before implementing. The same [authentication](#auth) and `workshopId` / `organizationId` parameters apply.', 'Combine o escopo com o ClearMechanic em [' + LINKS.email + '](mailto:' + LINKS.email + ') antes de implementar. Aplicam-se a mesma [autenticação](#auth) e os mesmos parâmetros `workshopId` / `organizationId`.') ] },
          { type: 'h', text: T('Clientes', 'Customers', 'Clientes') },
          { type: 'endpoints', ids: ['cmCustCreate', 'cmCustList', 'cmCustGet', 'cmCustUpdate', 'custCreate', 'custList', 'custGet', 'custUpdate'] },
          { type: 'h', text: T('Vehículos', 'Vehicles', 'Veículos') },
          { type: 'endpoints', ids: ['cmVehCreate', 'cmVehList', 'cmVehGet', 'cmVehUpdate', 'cmVehOwner', 'cmVehContactAdd', 'cmVehContactDel', 'vehicles', 'vehCreate', 'vehUpdate', 'vehWarranties', 'vehCampaigns'] },
          { type: 'h', text: T('Tareas', 'Tasks', 'Tarefas') },
          { type: 'p', text: T('Consulta primero los catálogos de prioridades, tipos y propósitos para construir el body de la tarea.', 'Query the priority, type and purpose catalogs first to build the task body.', 'Consulte primeiro os catálogos de prioridades, tipos e finalidades para montar o body da tarefa.') },
          { type: 'endpoints', ids: ['cmTaskPrio', 'cmTaskTypes', 'cmTaskPurposes', 'cmTaskCreate', 'cmTaskList', 'cmTaskGet', 'cmTaskUpdate', 'taskCreate', 'taskList', 'taskGet', 'taskUpdate'] }
        ] },

      /* ================================================================ */
      { id: 'planner', icon: '🗓️',
        title: T('Planeador de Taller', 'Workshop Planner', 'Planejador da Oficina'),
        summary: T('Trabajos (jobs) de citas y órdenes para planear la carga del taller.', 'Jobs for appointments and orders to plan the workshop load.', 'Serviços (jobs) de agendamentos e ordens para planejar a carga da oficina.'),
        blocks: [
          { type: 'p', text: T(
            'Integración **opcional e independiente**. El Planeador de Taller organiza los **trabajos (jobs)** asociados a citas y a OR: duración estimada, técnico asignado y puntos de inspección relacionados.',
            'An **optional, independent** integration. The Workshop Planner organizes the **jobs** linked to appointments and ROs: estimated duration, assigned technician and related inspection items.',
            'Integração **opcional e independente**. O Planejador da Oficina organiza os **serviços (jobs)** associados a agendamentos e OS: duração estimada, técnico atribuído e pontos de inspeção relacionados.') },
          { type: 'callout', variant: 'info',
            title: T('¿Cómo se habilita?', 'How is it enabled?', 'Como é habilitada?'),
            items: [ T('Requiere la integración estándar de citas y OR (los trabajos siempre pertenecen a un `appointmentNumber` u `orderNumber`). Acuerda el alcance con ClearMechanic antes de implementar.', 'Requires the standard appointments and ROs integration (jobs always belong to an `appointmentNumber` or `orderNumber`). Agree on the scope with ClearMechanic before implementing.', 'Requer a integração padrão de agendamentos e OS (os serviços sempre pertencem a um `appointmentNumber` ou `orderNumber`). Combine o escopo com o ClearMechanic antes de implementar.') ] },
          { type: 'h', text: T('DMS → ClearMechanic', 'DMS → ClearMechanic', 'DMS → ClearMechanic') },
          { type: 'endpoints', ids: ['cmPlannings', 'cmApptJobCreate', 'cmApptJobUpdate', 'cmApptJobDelete', 'cmOrderJobs', 'cmOrderJobCreate', 'cmOrderJobUpdate', 'cmOrderJobDelete'] },
          { type: 'h', text: T('ClearMechanic → DMS', 'ClearMechanic → DMS', 'ClearMechanic → DMS') },
          { type: 'endpoints', ids: ['jobCreate', 'jobUpdate', 'jobDelete', 'apptJobs', 'opCodes', 'technicians'] }
        ] },

      /* ================================================================ */
      { id: 'errors', icon: '⚠️',
        title: T('Manejo de errores', 'Error handling', 'Tratamento de erros'),
        summary: T('Códigos HTTP, estructura de error y resiliencia.', 'HTTP codes, error structure and resilience.', 'Códigos HTTP, estrutura de erro e resiliência.'),
        blocks: [
          { type: 'p', text: T('Ambas APIs usan códigos HTTP estándar. La estructura de error es consistente:', 'Both APIs use standard HTTP status codes. The error structure is consistent:', 'Ambas as APIs usam códigos HTTP padrão. A estrutura de erro é consistente:') },
          { type: 'code', code: '{\n  "success": false,\n  "message": "Error description.",\n  "data": []\n}' },
          { type: 'table',
            headers: [T('Código', 'Code', 'Código'), T('Significado y acción recomendada', 'Meaning and recommended action', 'Significado e ação recomendada')],
            rows: [
              [T('`200` / `201`', '`200` / `201`', '`200` / `201`'), T('Operación exitosa.', 'Successful operation.', 'Operação bem-sucedida.')],
              [T('`204`', '`204`', '`204`'), T('Operación exitosa sin body (p. ej. cierre de OR).', 'Successful operation with no body (e.g. RO closure).', 'Operação bem-sucedida sem body (ex.: fechamento de OS).')],
              [T('`400`', '`400`', '`400`'), T('Error en el body. Revisa campos requeridos y formatos; `message` indica el detalle.', 'Request body error. Check required fields and formats; `message` gives the detail.', 'Erro no body. Verifique campos obrigatórios e formatos; `message` indica o detalhe.')],
              [T('`401`', '`401`', '`401`'), T('Token inválido o expirado. Renueva el `accessToken` con `POST /users/login`.', 'Invalid or expired token. Renew the `accessToken` with `POST /users/login`.', 'Token inválido ou expirado. Renove o `accessToken` com `POST /users/login`.')],
              [T('`404`', '`404`', '`404`'), T('Recurso no encontrado. Verifica IDs y parámetros.', 'Resource not found. Check IDs and parameters.', 'Recurso não encontrado. Verifique IDs e parâmetros.')],
              [T('`500`', '`500`', '`500`'), T('Error interno. Reintenta tras un intervalo; si persiste, contacta a ClearMechanic.', 'Internal server error. Retry after an interval; if it persists, contact ClearMechanic.', 'Erro interno. Tente novamente após um intervalo; se persistir, contate o ClearMechanic.')]
            ] },
          { type: 'h', text: T('Política de reintentos de webhooks', 'Webhook retry policy', 'Política de novas tentativas de webhooks') },
          { type: 'p', text: T(
            'Si el DMS no responde con éxito a un webhook (error 5xx, timeout o sin respuesta), ClearMechanic lo reintenta **hasta 4 veces** con intervalos crecientes:',
            'If the DMS does not respond successfully to a webhook (5xx error, timeout or no response), ClearMechanic retries it **up to 4 times** with increasing intervals:',
            'Se o DMS não responder com sucesso a um webhook (erro 5xx, timeout ou sem resposta), o ClearMechanic o reenvia **até 4 vezes** com intervalos crescentes:') },
          { type: 'retry', delays: [0.5, 1, 2, 4],
            first: T('Envío original', 'Original call', 'Envio original'),
            retry: T('Reintento', 'Retry', 'Tentativa'),
            after: T('después de', 'after', 'após') },
          { type: 'callout', variant: 'warn',
            title: T('Implicaciones para el DMS', 'Implications for the DMS', 'Implicações para o DMS'),
            items: [
              T('Un mismo webhook puede llegar más de una vez: procésalo de forma **idempotente** (usa `orderNumber` / `appointmentNumber` como llave).', 'The same webhook can arrive more than once: process it **idempotently** (use `orderNumber` / `appointmentNumber` as the key).', 'O mesmo webhook pode chegar mais de uma vez: processe-o de forma **idempotente** (use `orderNumber` / `appointmentNumber` como chave).'),
              T('Todos los reintentos ocurren en ~7.5 segundos: si tu servicio está caído más tiempo, el evento se pierde. Monitorea la disponibilidad de tus endpoints.', 'All retries happen within ~7.5 seconds: if your service is down longer, the event is lost. Monitor your endpoints\' availability.', 'Todas as novas tentativas ocorrem em ~7,5 segundos: se seu serviço ficar fora do ar por mais tempo, o evento é perdido. Monitore a disponibilidade dos seus endpoints.'),
              T('Responde rápido y procesa en segundo plano si la operación es pesada.', 'Respond fast and process in the background if the operation is heavy.', 'Responda rápido e processe em segundo plano se a operação for pesada.')
            ] },
          { type: 'callout', variant: 'tip',
            title: T('Recomendaciones de resiliencia', 'Resilience recommendations', 'Recomendações de resiliência'),
            items: [
              T('Implementa reintentos con backoff exponencial para errores 5xx.', 'Implement retries with exponential backoff for 5xx errors.', 'Implemente novas tentativas com backoff exponencial para erros 5xx.'),
              T('En webhooks entrantes, responde con el código HTTP correspondiente según éxito o error.', 'For incoming webhooks, respond with the HTTP code matching success or error.', 'Nos webhooks recebidos, responda com o código HTTP correspondente a sucesso ou erro.'),
              T('Registra todos los payloads enviados y recibidos para facilitar la depuración.', 'Log all sent and received payloads to ease debugging.', 'Registre todos os payloads enviados e recebidos para facilitar a depuração.'),
              T('Implementa idempotencia usando `orderNumber` o `appointmentNumber` como llave.', 'Implement idempotency using `orderNumber` or `appointmentNumber` as the key.', 'Implemente idempotência usando `orderNumber` ou `appointmentNumber` como chave.')
            ] }
        ] },

      /* ================================================================ */
      { id: 'reference', icon: '📚',
        title: T('Referencia de endpoints', 'Endpoint reference', 'Referência de endpoints'),
        summary: T('Todos los endpoints, filtrables, con enlace directo a SwaggerHub.', 'All endpoints, filterable, with direct SwaggerHub links.', 'Todos os endpoints, filtráveis, com link direto ao SwaggerHub.'),
        blocks: [
          { type: 'p', text: T(
            'Todos los endpoints de ambas APIs. La integración **Estándar** (citas, OR y cotizaciones) es la base; **CRM**, **Planeador** y **Adicional** son integraciones independientes que se habilitan según lo acordado con ClearMechanic. Cada enlace **Docs** abre la operación exacta en SwaggerHub.',
            'All endpoints from both APIs. The **Standard** integration (appointments, ROs and quotes) is the base; **CRM**, **Planner** and **Additional** are independent integrations enabled as agreed with ClearMechanic. Each **Docs** link opens the exact operation in SwaggerHub.',
            'Todos os endpoints das duas APIs. A integração **Padrão** (agendamentos, OS e orçamentos) é a base; **CRM**, **Planejador** e **Adicional** são integrações independentes habilitadas conforme acordado com o ClearMechanic. Cada link **Docs** abre a operação exata no SwaggerHub.') },
          { type: 'explorer' }
        ] },

      /* ================================================================ */
      { id: 'checklist', icon: '✅',
        title: T('Checklist de implementación', 'Implementation checklist', 'Checklist de implementação'),
        summary: T('Verifica que todo esté cubierto antes del go-live.', 'Verify everything is covered before go-live.', 'Verifique se tudo está coberto antes do go-live.'),
        blocks: [
          { type: 'checklist', groups: [
            { title: T('Autenticación', 'Authentication', 'Autenticação'), items: [
              T('Implementar `POST /users/login` y manejo del JWT `accessToken`.', 'Implement `POST /users/login` and JWT `accessToken` handling.', 'Implementar `POST /users/login` e o gerenciamento do JWT `accessToken`.'),
              T('Renovación automática del token (cada 3 horas / antes de expirar).', 'Automatic token renewal (every 3 hours / before expiration).', 'Renovação automática do token (a cada 3 horas / antes de expirar).'),
              T('Definir y comunicar a ClearMechanic el esquema de autenticación de los webhooks.', 'Define and communicate to ClearMechanic the webhook authentication scheme.', 'Definir e comunicar ao ClearMechanic o esquema de autenticação dos webhooks.'),
              T('Todos los endpoints del DMS en HTTPS.', 'All DMS endpoints on HTTPS.', 'Todos os endpoints do DMS em HTTPS.'),
              T('Enviar `workshopId` en cada llamada a la CM Product API y leer el header `organizationId` en cada webhook (multi-agencia).', 'Send `workshopId` on every CM Product API call and read the `organizationId` header on every webhook (multi-dealer).', 'Enviar `workshopId` em cada chamada à CM Product API e ler o header `organizationId` em cada webhook (multiconcessionária).'),
              T('Procesar webhooks de forma idempotente (ClearMechanic reintenta hasta 4 veces).', 'Process webhooks idempotently (ClearMechanic retries up to 4 times).', 'Processar webhooks de forma idempotente (o ClearMechanic reenvia até 4 vezes).')
            ] },
            { title: T('Catálogos y configuración', 'Catalogs and setup', 'Catálogos e configuração'), items: [
              T('Configurar `serviceAdvisorExternalId`, `userWhoScheduleExternalId` y `technicianExternalId` en los usuarios de ClearMechanic.', 'Configure `serviceAdvisorExternalId`, `userWhoScheduleExternalId` and `technicianExternalId` on ClearMechanic users.', 'Configurar `serviceAdvisorExternalId`, `userWhoScheduleExternalId` e `technicianExternalId` nos usuários do ClearMechanic.'),
              T('Consultar `GET /cm/customReasons` para saber si el dashboard usa motivos personalizados.', 'Query `GET /cm/customReasons` to know whether the dashboard uses custom reasons.', 'Consultar `GET /cm/customReasons` para saber se o dashboard usa motivos personalizados.'),
              T('Consultar `GET /cm/phases` para obtener los IDs de fase.', 'Query `GET /cm/phases` to obtain phase IDs.', 'Consultar `GET /cm/phases` para obter os IDs de fase.'),
              T('Implementar `GET /vehicles` en el DMS (búsqueda por VIN y por placa).', 'Implement `GET /vehicles` in the DMS (search by VIN and by plate).', 'Implementar `GET /vehicles` no DMS (busca por VIN e por placa).'),
              T('Implementar `GET /advisors` en el DMS.', 'Implement `GET /advisors` in the DMS.', 'Implementar `GET /advisors` no DMS.')
            ] },
            { title: T('Flujo 1 — Citas', 'Flow 1 — Appointments', 'Fluxo 1 — Agendamentos'), items: [
              T('Llamar `POST /cm/v2/appointments` al crear una cita en el DMS.', 'Call `POST /cm/v2/appointments` when creating an appointment in the DMS.', 'Chamar `POST /cm/v2/appointments` ao criar um agendamento no DMS.'),
              T('Llamar `PATCH /cm/appointments/{appointmentNumber}` al actualizar una cita.', 'Call `PATCH /cm/appointments/{appointmentNumber}` when updating an appointment.', 'Chamar `PATCH /cm/appointments/{appointmentNumber}` ao atualizar um agendamento.'),
              T('Llamar `DELETE /cm/appointments/{appointmentNumber}` al eliminar una cita.', 'Call `DELETE /cm/appointments/{appointmentNumber}` when deleting an appointment.', 'Chamar `DELETE /cm/appointments/{appointmentNumber}` ao excluir um agendamento.'),
              T('Implementar `POST /appointments` para recibir creaciones desde CM.', 'Implement `POST /appointments` to receive creations from CM.', 'Implementar `POST /appointments` para receber criações do CM.'),
              T('Implementar `PATCH /appointments/{appointmentId}` para recibir actualizaciones.', 'Implement `PATCH /appointments/{appointmentId}` to receive updates.', 'Implementar `PATCH /appointments/{appointmentId}` para receber atualizações.'),
              T('Implementar `DELETE /appointments/{appointmentId}` para recibir eliminaciones.', 'Implement `DELETE /appointments/{appointmentId}` to receive deletions.', 'Implementar `DELETE /appointments/{appointmentId}` para receber exclusões.')
            ] },
            { title: T('Flujo 2 — Órdenes de Reparación', 'Flow 2 — Repair Orders', 'Fluxo 2 — Ordens de Serviço'), items: [
              T('Llamar `POST /cm/v2/orders` al crear una OR en el DMS.', 'Call `POST /cm/v2/orders` when creating an RO in the DMS.', 'Chamar `POST /cm/v2/orders` ao criar uma OS no DMS.'),
              T('Llamar `PATCH /cm/v2/orders/{orderNumber}` al actualizar una OR.', 'Call `PATCH /cm/v2/orders/{orderNumber}` when updating an RO.', 'Chamar `PATCH /cm/v2/orders/{orderNumber}` ao atualizar uma OS.'),
              T('Llamar `PUT /cm/orders/{orderNumber}/close` al cerrar una OR.', 'Call `PUT /cm/orders/{orderNumber}/close` when closing an RO.', 'Chamar `PUT /cm/orders/{orderNumber}/close` ao fechar uma OS.'),
              T('Implementar `POST /orders` para recibir creaciones de OR desde CM.', 'Implement `POST /orders` to receive RO creations from CM.', 'Implementar `POST /orders` para receber criações de OS do CM.'),
              T('Implementar `PATCH /orders/{orderNumber}` para recibir actualizaciones de OR.', 'Implement `PATCH /orders/{orderNumber}` to receive RO updates.', 'Implementar `PATCH /orders/{orderNumber}` para receber atualizações de OS.'),
              T('Implementar `PUT /orders/{orderNumber}/closeOrder` para recibir cierres de OR.', 'Implement `PUT /orders/{orderNumber}/closeOrder` to receive RO closures.', 'Implementar `PUT /orders/{orderNumber}/closeOrder` para receber fechamentos de OS.')
            ] },
            { title: T('Flujo 3 — Cotizaciones', 'Flow 3 — Quotes', 'Fluxo 3 — Orçamentos'), items: [
              T('Implementar `GET /inventoryItems` con filtros `keyword`, `make`, `model`, `year`, `orderNumber`.', 'Implement `GET /inventoryItems` with `keyword`, `make`, `model`, `year`, `orderNumber` filters.', 'Implementar `GET /inventoryItems` com filtros `keyword`, `make`, `model`, `year`, `orderNumber`.'),
              T('Implementar `GET /inventoryItems/{itemId}` para agregar una refacción o mano de obra directamente por su ID.', 'Implement `GET /inventoryItems/{itemId}` to add a part or labor directly by its ID.', 'Implementar `GET /inventoryItems/{itemId}` para adicionar uma peça ou mão de obra diretamente pelo ID.'),
              T('Implementar `POST /quotes` para recibir cotizaciones desde CM.', 'Implement `POST /quotes` to receive quotes from CM.', 'Implementar `POST /quotes` para receber orçamentos do CM.')
            ] }
          ] }
        ] },

      /* ================================================================ */
      { id: 'support', icon: '💬',
        title: T('Soporte y novedades', 'Support and updates', 'Suporte e novidades'),
        summary: T('Contacto, documentación y cambios de la guía.', 'Contact, documentation and guide changes.', 'Contato, documentação e mudanças do guia.'),
        blocks: [
          { type: 'p', text: T('Para cualquier duda técnica durante la integración, contacta al equipo de ClearMechanic:', 'For any technical question during the integration, contact the ClearMechanic team:', 'Para qualquer dúvida técnica durante a integração, contate a equipe do ClearMechanic:') },
          { type: 'cards', items: [
            { icon: '✉️', href: 'mailto:' + LINKS.email, title: T('Email técnico', 'Technical email', 'E-mail técnico'), text: T(LINKS.email, LINKS.email, LINKS.email) },
            { icon: '📘', href: LINKS.productApi, title: T('CM Product API', 'CM Product API', 'CM Product API'), text: T('SwaggerHub', 'SwaggerHub', 'SwaggerHub') },
            { icon: '📗', href: LINKS.dmsApi, title: T('Guía DMS', 'DMS API Guide', 'Guia DMS'), text: T('SwaggerHub', 'SwaggerHub', 'SwaggerHub') },
            { icon: '🧪', href: LINKS.sandbox, title: T('API Sandbox', 'API Sandbox', 'API Sandbox'), text: T('oasandbox.somosclear.com', 'oasandbox.somosclear.com', 'oasandbox.somosclear.com') }
          ] },
          { type: 'h', text: T('Historial de cambios', 'Changelog', 'Histórico de alterações') },
          { type: 'changelog' }
        ] }
    ]
  };
}
