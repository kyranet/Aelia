import { BitFieldResolvable } from 'discord.js';
import { CommandOptions, Command, CommandStore, util } from 'klasa';
import { MusicBitField, MusicBitFieldString } from './MusicBitField';

export abstract class MusicCommand extends Command {

	/**
	 * Whether this command requires an active VoiceConnection or not
	 */
	public music: MusicBitField;

	public constructor(store: CommandStore, file: string[], directory: string, options: MusicCommandOptions = {}) {
		// By nature, music commands only run in VoiceChannels, which are in Guilds.
		util.mergeDefault({ runIn: ['text'], requireMusic: 0 }, options);

		super(store, file, directory, options);
		this.music = new MusicBitField(options.music);
	}

}

/**
 * The music command options
 */
export type MusicCommandOptions = CommandOptions & {
	music?: BitFieldResolvable<MusicBitFieldString>;
};
