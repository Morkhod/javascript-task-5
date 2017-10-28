'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            events.push({ event, context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            events = events.filter(ev =>
                !(ev.context === context &&
                    (ev.event === event || ev.event.startsWith(event + '.'))));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const split = event.split('.');
            const regexpArr = split.reduceRight((acc, cur, i) =>
                (acc.concat(new RegExp(`^${split.slice(0, i + 1).join('.')}$`))), []);
            events
                .filter(ev => regexpArr.some(re => re.test(ev.event)))
                .sort((a, b) => b.event.split('.').length - a.event.split('.').length)
                .forEach(ev => ev.handler.call(ev.context));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, () => {
                if (times-- > 0) {
                    handler.call(context);
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            let count = 0;
            this.on(event, context, () => {
                if (count++ % frequency === 0) {
                    handler.call(context);
                }
            });

            return this;
        }
    };
}
