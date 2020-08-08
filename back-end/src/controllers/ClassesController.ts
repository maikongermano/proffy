import {Request, Response} from 'express';
import db from '../database/connections';
import converterHourToMinute from '../utils/converterHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    // listagem
    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        // não informo o dia da semana, a materia e o horario 
        if ( !week_day  || !subject || !time ){
            return response.json(400).json({
                error: 'Missing filters to search classes'
            });
        }

        const timeInMinutes = converterHourToMinute(time);

        // confirma se tem registro no dia na materia e no horario selecionando
        const classes = await db('classes')
          .whereExists(function() {
              this.select('class_schedule.*')
                 .from('class_schedule')
                 .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                 .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                 .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                 .whereRaw('`class_schedule`.`to`  > ??', [timeInMinutes])
          })
          .where('classes.subject', '=', subject)
          .join('users', 'classes.user_id', '=', 'users.id')
          .select(['classes.*', 'users.*']);

        return response.json(classes);


    }

    // criação
    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const trx = await db.transaction();

        try {
            // criação usuário
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            }); 

            const user_id = insertedUsersIds[0];

            const insertedClassesIDS = await trx('classes').insert({
                subject,
                cost,
                user_id,
            })

            const class_id = insertedClassesIDS[0];

            
            // conveter hora
            const ClassSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: converterHourToMinute(scheduleItem.from),
                    to: converterHourToMinute(scheduleItem.to),
                };
            });

            await trx('class_schedule').insert(ClassSchedule);


            await trx.commit();
            

            return response.status(201).send();
        } catch (err) {
            await trx.rollback();

            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }

} 