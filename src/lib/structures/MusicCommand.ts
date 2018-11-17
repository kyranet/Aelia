import { BitFieldResolvable } from 'discord.js';
import { Command, CommandOptions, CommandStore, util } from 'klasa';
import { AeliaClient } from '../AeliaClient';
import { MusicBitField, MusicBitFieldString } from './MusicBitField';

export class MusicCommand extends Command {

	/**
	 * Whether this command requires an active VoiceConnection or not
	 */
	public music: MusicBitField;

	public constructor(client: AeliaClient, store: CommandStore, file: string[], directory: string, options: MusicCommandOptions = {}) {
		// By nature, music commands only run in VoiceChannels, which are in Guilds.
		util.mergeDefault({ runIn: ['text'], requireMusic: 0 }, options);

		super(client, store, file, directory, options);
		this.music = new MusicBitField(options.music);
	}

}

/**
 * The music command options
 */
export type MusicCommandOptions = CommandOptions & {
	music?: BitFieldResolvable<MusicBitFieldString>;
};